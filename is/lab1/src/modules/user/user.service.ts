import { ConflictException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { subMilliseconds } from 'date-fns';
import { In, LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity.js';
import { UserStatusEntity } from './entities/user-status.entity.js';
import { UserStatus } from './enums/user-status.enum.js';
import { CreateUserParams } from './types/create-user.js';
import { EditUserParams } from './types/edit-user.js';
import { EditUsersParams } from './types/edit-users.js';
import { GetUserStatusInfoReturnType } from './types/get-user-status-info.js';
import { createPointExpirationHeadsNotification } from './utils/create-point-expiration-headsup-notification.js';
import { createPointsExpiredNotification } from './utils/create-points-expired-notification.js';
import { getUserIdsGroupedByExpiryDateInMs } from './utils/get-users-grouped-by-points-expiry-date.js';

import { BadRequestException } from '../common/exceptions/bad-request.exception.js';
import { lifetimePointsConfig } from '../config/lifetime-points.js';
import { CryptoService } from '../crypto/crypto.service.js';
import { NotificationEvent } from '../notification/events/constants.js';
import { SendNotificationsEvent } from '../notification/events/send-notifications.event.js';
import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { DeletePointTransactionEvent } from '../point-transaction/events/delete-point-transaction.event.js';
import { NewPointTransactionEvent } from '../point-transaction/events/new-point-transaction.event.js';

// TODO extract to sub services
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserStatusEntity)
    private userStatusRepository: Repository<UserStatusEntity>,
    @InjectRepository(PointTransactionEntity)
    private readonly pointTransactionRepository: Repository<PointTransactionEntity>,
    private cryptoService: CryptoService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getUserIdsWithinPointExpirationNotificationRange(): Promise<
    Record<string, number[]>
  > {
    const { beforeExpiryNotificationRangesInMs, notificationTimeDeltaInMs } =
      lifetimePointsConfig;

    const earliestDateBeforeExpiryInMs = Math.min(
      ...beforeExpiryNotificationRangesInMs,
    );

    // * get users who have the greatest amount of time before expiration, also bear in mind for the delta
    const users = await this.userRepository.find({
      where: {
        lastResetPointsAt: LessThanOrEqual(
          subMilliseconds(new Date(), earliestDateBeforeExpiryInMs),
        ),
      },
    });

    const usersWithPositiveBalance =
      await this.filterUserWithPositiveBalance(users);

    return getUserIdsGroupedByExpiryDateInMs({
      users: usersWithPositiveBalance,
      beforeExpiryNotificationRangesInMs:
        lifetimePointsConfig.beforeExpiryNotificationRangesInMs,
      expirationDurationInMs: lifetimePointsConfig.lifetimeInMs,
      notificationTimeDeltaInMs,
    });
  }

  async getUserIdsToResetStatus(): Promise<number[]> {
    const { lifetimeInMs } = lifetimePointsConfig;

    const expirationDate = subMilliseconds(new Date(), lifetimeInMs);

    // * get users who have the greatest amount of time before expiration
    const users = await this.userRepository.find({
      where: {
        lastResetPointsAt: LessThanOrEqual(expirationDate),
      },
    });

    const usersWithPositiveBalance =
      await this.filterUserWithPositiveBalance(users);

    return usersWithPositiveBalance.map((user) => user.id);
  }

  async filterUserWithPositiveBalance(
    users: UserEntity[],
  ): Promise<UserEntity[]> {
    const usersWithPositiveBalance: UserEntity[] = [];

    // eslint-disable-next-line no-restricted-syntax -- it's okay here
    for await (const user of users) {
      const pointsAmount = await this.getPointsAmountByUserId(user.id);

      if (pointsAmount > 0) {
        usersWithPositiveBalance.push(user);
      }
    }

    return usersWithPositiveBalance;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { status: true },
    });

    return user;
  }

  async getUserByIdOrFail(userId: number): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: { status: true },
    });
  }

  async getUsersDeviceTokenByIds(userIds: number[]): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { id: In(userIds) },
      select: {
        deviceToken: true,
        id: true,
      },
    });
  }

  async updateUserById(params: EditUserParams): Promise<UserEntity> {
    this.logger.debug('Updating user data...');
    const { data, id } = params;

    const userData: Partial<UserEntity> = data;

    if (data.oldPassword && data.newPassword) {
      this.logger.debug('Verifying old password...');
      await this.verifyOldPassword(id, data.oldPassword);

      this.logger.debug('Hashing new password...');
      userData.password = await this.cryptoService.hashPassword(
        data.newPassword,
      );

      // * clean values as typeorm will throw error about unknown fields
      delete data.oldPassword;
      delete data.newPassword;
    }

    await this.userRepository.update(id, userData);

    return this.getUserByIdOrFail(id);
  }

  async updateUsersByIds(params: EditUsersParams): Promise<void> {
    this.logger.debug('Updating user data...');
    const { data, ids } = params;

    await this.userRepository.update(ids, data);
  }

  async getUserStatusInfo(
    userId: number,
  ): Promise<GetUserStatusInfoReturnType> {
    const user = await this.getUserByIdOrFail(userId);

    const nextStatuses = await this.userStatusRepository.find({
      where: {
        cost: MoreThan(user.status.cost),
      },
      order: {
        cost: 'ASC',
      },
    });

    const nextStatus = nextStatuses.at(0);

    return {
      currentStatus: user.status,
      nextStatus,
      pointsAmount: user.pointsAmount,
    };
  }

  async createUser(data: CreateUserParams): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with such email or phone number already exists!',
      );
    }

    const startedUserStatus = await this.userStatusRepository.findOneOrFail({
      where: { name: UserStatus.Bronze },
    });

    const hashedPassword = await this.cryptoService.hashPassword(data.password);

    const newUser = await this.userRepository.save({
      ...data,
      password: hashedPassword,
      status: startedUserStatus,
      lastResetPointsAt: data.lastResetPointsAt ?? new Date(),
    });

    return newUser;
  }

  async getUserByEmailOrFail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({
      where: { email },
      relations: { status: true },
    });
  }

  async updateUserByEmail(
    email: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.userRepository.update({ email }, data);

    const user = await this.getUserByEmailOrFail(email);

    return user;
  }

  async deactivateUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      relations: { status: true },
    });

    await this.userRepository.update(id, { isActive: false });

    user.isActive = false;

    return user;
  }

  private async verifyOldPassword(
    userId: number,
    password: string,
  ): Promise<void> {
    const { password: userOldPassword } = await this.getUserByIdOrFail(userId);

    const isValidPassword = await this.cryptoService.verifyPassword(
      password,
      userOldPassword,
    );

    if (!isValidPassword) {
      throw new BadRequestException({
        field: 'oldPassword',
        message: 'Old password does not match',
      });
    }
  }

  async updateUserStatusIfPossible(
    event: NewPointTransactionEvent,
  ): Promise<void> {
    const { userId } = event.payload;

    this.logger.verbose(
      this.updateUserStatusIfPossible.name,
      `New point transaction event for user ${userId}`,
    );

    const { status: currentStatus } = await this.getUserByIdOrFail(userId);

    const pointsAmount = await this.getPointsAmountByUserId(userId);

    const nextStatus =
      await this.findHighestStatusForPointsAmount(pointsAmount);

    // TODO look for statuses that user can reach
    // ? Need to find the highest possible status for user in function to update user status
    // * if there is new status available AND user has more or equal points for new status give him rise
    if (nextStatus && nextStatus.id !== currentStatus.id) {
      this.logger.debug(
        `Updating status for user ${userId} from ${currentStatus.id} to ${nextStatus.id}`,
      );

      await this.updateUserById({
        id: userId,
        data: {
          statusId: nextStatus.id,
        },
      });
    }
  }

  async downgradeUserStatusIfPossible(
    event: DeletePointTransactionEvent,
  ): Promise<void> {
    const { pointTransaction } = event.payload;

    this.logger.verbose(
      `Delete point transaction event for point transaction ${pointTransaction.id}`,
    );

    const user = await this.getUserByIdOrFail(pointTransaction.userId);

    const { pointsAmount } = user;
    // const pointsAmount =
    //   await this.pointTransactionService.getPointsAmountByUserId(
    //     pointTransaction.userId,
    //   );

    const actualStatus =
      await this.calculateUserStatusFromPointsAmount(pointsAmount);

    // * user status hasn't downgraded, skip
    if (!actualStatus || actualStatus.id === user.statusId) {
      return;
    }

    // * if user have points less than the current status, downgrade theirs status
    this.logger.debug(
      `Downgrading status for user ${user.id} from ${user.status.id} to ${actualStatus.id}`,
    );

    await this.updateUserById({
      id: user.id,
      data: {
        statusId: actualStatus.id,
      },
    });
  }

  // TODO write tests for it
  async findHighestStatusForPointsAmount(
    pointsAmount: number,
  ): Promise<UserStatusEntity | null> {
    const statusBasedOnPoints = await this.userStatusRepository.findOne({
      where: {
        cost: LessThanOrEqual(pointsAmount),
      },
      order: {
        // * get the closest status to user by cost
        cost: 'DESC',
      },
    });

    return statusBasedOnPoints;
  }

  /**
   * @description find the status with maximum amount of points required for the given user
   */
  async calculateUserStatusFromPointsAmount(
    pointsAmount: number,
  ): Promise<UserStatusEntity | null> {
    const statusBasedOnPoints = await this.userStatusRepository.findOne({
      where: {
        cost: LessThanOrEqual(pointsAmount),
      },
      order: {
        cost: 'DESC',
      },
    });

    return statusBasedOnPoints;
  }

  async createUserStatus(
    status: Partial<UserStatusEntity>,
  ): Promise<UserStatusEntity> {
    const newStatus = await this.userStatusRepository.save(status);

    return newStatus;
  }

  async getPointsAmountByUserId(userId: number): Promise<number> {
    const { lastResetPointsAt } = await this.getUserByIdOrFail(userId);

    const result = (await this.pointTransactionRepository
      .createQueryBuilder('point_transaction')
      .select('SUM(point_transaction.amount)', 'total')
      .where('point_transaction.userId = :userId', { userId })
      .andWhere('point_transaction.created_at >= :lastResetPointsAt', {
        lastResetPointsAt,
      })
      .getRawOne()) as { total: number } | undefined;

    return Number(result?.total ?? 0);
  }

  async downgradeUsersStatusWithExpiredPoints(): Promise<void> {
    this.logger.log('Running cron job to expire user points');

    const initialStatus = await this.calculateUserStatusFromPointsAmount(0);

    const ids = await this.getUserIdsToResetStatus();

    if (!ids.length) {
      return;
    }

    this.logger.debug('Resetting statuses for users', ids);

    await this.updateUsersByIds({
      ids,
      data: {
        statusId: initialStatus?.id,
        lastResetPointsAt: new Date(),
      },
    });

    this.eventEmitter.emit(
      NotificationEvent.SendNotifications,
      new SendNotificationsEvent(
        createPointsExpiredNotification({ userIds: ids }),
      ),
    );
  }

  async sendPointsExpiryNotification(): Promise<void> {
    this.logger.log('Running cron job to send expiry points notification');

    const notificationDateToUserId =
      await this.getUserIdsWithinPointExpirationNotificationRange();

    if (!Object.keys(notificationDateToUserId).length) {
      return;
    }

    this.logger.debug(
      'Sending notifications about points expiration to users',
      notificationDateToUserId,
    );

    Object.entries(notificationDateToUserId).forEach(
      ([timeLeftInMs, userIds]) => {
        this.eventEmitter.emit(
          NotificationEvent.SendNotifications,
          new SendNotificationsEvent(
            createPointExpirationHeadsNotification({
              userIds,
              timeRemainingInMs: Number(timeLeftInMs),
            }),
          ),
        );
      },
    );
  }
}
