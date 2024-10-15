import { BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  FindOperator,
  In,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { ClaimEntity } from './entities/claim.entity.js';
import { RewardEntity } from './entities/reward.entity.js';
import { ClaimStatus } from './enums/claim-status.enum.js';
import { RewardStatus } from './enums/reward-status.enum.js';
import {
  GetPaginatedRewardsParams,
  GetPaginatedRewardsReturnType,
} from './types/get-paginated-rewards.js';
import { GetRewardParams, GetRewardReturnType } from './types/get-reward.js';
import { RewardWithStatus } from './types/reward-with-status.js';
import { createClaimedRewardEmailContent } from './utils/create-claimed-reward-email-content.js';
import { createClaimedRewardNotificationContent } from './utils/create-claimed-reward-notification-content.js';

import { MailingEvent } from '../mailing/events/constants.js';
import { SendHtmlEmailEvent } from '../mailing/events/send-html-email.even.js';
import { NotificationEvent } from '../notification/events/constants.js';
import { SendNotificationEvent } from '../notification/events/send-notification.event.js';
import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { PointTransactionService } from '../point-transaction/point-transaction.service.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { Status } from '../user/types/status.js';
import { UserService } from '../user/user.service.js';

export class RewardService {
  private logger = new Logger(RewardService.name);

  constructor(
    private readonly userService: UserService,
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: Repository<RewardEntity>,
    @InjectRepository(ClaimEntity)
    private readonly claimRepository: Repository<ClaimEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly pointTransactionService: PointTransactionService,
  ) {}

  async createReward(
    params: Partial<Omit<RewardEntity, 'id'>>,
  ): Promise<RewardEntity> {
    return this.rewardRepository.save(params);
  }

  async getClaimsByUserId(userId: number): Promise<ClaimEntity[]> {
    const claims = await this.claimRepository.find({
      where: {
        userId,
      },
      relations: {
        reward: {
          attachments: true,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return claims;
  }

  async getRewardWithStatusByUserIdOrFail(
    params: GetRewardParams,
  ): Promise<GetRewardReturnType> {
    const { rewardId, userId } = params;

    const reward = await this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.attachments', 'attachments')
      .leftJoinAndMapMany(
        'reward.claims',
        ClaimEntity,
        'claim',
        'claim.rewardId = reward.id AND claim.userId = :userId',
        { userId },
      )
      .where('reward.id = :rewardId', { rewardId })
      .andWhere('reward.isHidden = :isHidden', { isHidden: false })
      .getOne();

    if (!reward) {
      throw new BadRequestException('Reward with provided id not found.');
    }

    const userStatus = await this.userService.getUserStatusInfo(userId);

    return this.prepareRewardWithStatus(reward, userStatus);
  }

  async getPaginatedRewardsByUserId(
    params: GetPaginatedRewardsParams,
  ): Promise<GetPaginatedRewardsReturnType> {
    const { page, take, userId } = params;

    const { lastResetPointsAt } =
      await this.userService.getUserByIdOrFail(userId);

    // get rewards with claims (only current user claims)
    const [rewards, count] = await this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.attachments', 'attachments')
      .leftJoinAndMapMany(
        'reward.claims',
        ClaimEntity,
        'claim',
        'claim.rewardId = reward.id AND claim.userId = :userId AND claim.createdAt >= :lastResetPointsAt',
        { userId, lastResetPointsAt },
      )
      .where('reward.isHidden = :isHidden', { isHidden: false })
      .orderBy('reward.cost', 'ASC')
      .skip((page - 1) * take)
      .take(take)
      .getManyAndCount();

    const userStatus = await this.userService.getUserStatusInfo(userId);

    const preparedRewards = rewards.map((reward) =>
      this.prepareRewardWithStatus(reward, userStatus),
    );

    return { rewards: preparedRewards, itemsCount: count };
  }

  async getLatestClaimByUserId(userId: number): Promise<ClaimEntity | null> {
    const { lastResetPointsAt } =
      await this.userService.getUserByIdOrFail(userId);

    return this.claimRepository.findOne({
      where: {
        userId,
        createdAt: MoreThanOrEqual(lastResetPointsAt),
      },
      order: {
        reward: {
          cost: 'desc',
        },
      },
      relations: {
        reward: true,
      },
    });
  }

  async getAvailableRewardsByUserId(userId: number): Promise<RewardEntity[]> {
    const pointsAmount = await this.userService.getPointsAmountByUserId(userId);

    const findOperators: FindOperator<number>[] = [
      LessThanOrEqual(pointsAmount),
    ];

    const lastClaimedReward = await this.getLatestClaimByUserId(userId);

    // * if there is last claimed reward, look for all rewards that are higher in price
    if (lastClaimedReward?.reward.cost) {
      findOperators.push(MoreThan(lastClaimedReward.reward.cost));
    }

    const rewards = await this.rewardRepository.find({
      where: {
        cost: And(...findOperators),
        // * retrieve only available rewards
        isHidden: false,
      },
    });

    return rewards;
  }

  async claimAvailableRewards(userId: number): Promise<void> {
    this.logger.debug('Checking for available rewards', { userId });

    const availableRewards = await this.getAvailableRewardsByUserId(userId);

    if (!availableRewards.length) {
      return;
    }

    const claims = await Promise.allSettled(
      availableRewards.map((reward) => {
        return this.claimRepository.save({
          rewardId: reward.id,
          userId,
        });
      }),
    );

    const user = await this.userService.getUserByIdOrFail(userId);

    void this.sendRewardsClaimedEmail(user, availableRewards);

    void this.sendRewardsClaimedNotification(user, availableRewards);

    this.logger.debug('Claimed rewards', { claims, userId });
  }

  async disclaimUnavailableRewards(
    deletedPointTransaction: PointTransactionEntity,
  ): Promise<void> {
    const { userId } = deletedPointTransaction;

    const user = await this.userService.getUserByIdOrFail(
      deletedPointTransaction.userId,
    );

    // find all rewards which have been claimed by user but not unavailable now
    const unavailableClaims = await this.claimRepository.find({
      where: {
        userId,
        reward: {
          cost: MoreThan(user.pointsAmount),
        },
      },
      relations: {
        reward: true,
      },
    });

    this.logger.debug('Disclaiming rewards', {
      rewards: unavailableClaims,
      userId,
    });

    const claimIds = unavailableClaims.map((claim) => claim.id);

    await this.claimRepository.delete({
      id: In(claimIds),
      userId,
    });

    this.logger.debug('Claims have been deleted', { claimIds });
  }

  private sendRewardsClaimedEmail(
    user: UserEntity,
    claimedRewards: RewardEntity[],
  ): void {
    claimedRewards.forEach((reward) => {
      this.eventEmitter.emit(
        MailingEvent.SendHtmlEmail,
        new SendHtmlEmailEvent(createClaimedRewardEmailContent(reward, user)),
      );
    });
  }

  private sendRewardsClaimedNotification(
    user: UserEntity,
    claimedRewards: RewardEntity[],
  ): void {
    claimedRewards.forEach((reward) => {
      const content = createClaimedRewardNotificationContent(reward, user);

      this.eventEmitter.emit(
        NotificationEvent.SendNotification,
        new SendNotificationEvent({ content, userId: user.id }),
      );
    });
  }

  private prepareRewardWithStatus(
    reward: RewardEntity,
    userStatus: Status,
  ): RewardWithStatus {
    // reward.claims is currently an array containing user-specific claims for the reward.
    // We are currently taking the first claim from this array.
    // However, when the isArchived field will be added to the claim, the reward.claims array will contain only one record (where isArchived false) or will be empty.
    const userRewardClaim = reward.claims[0] || undefined;

    return {
      reward,
      status: this.getRewardStatus(reward, userStatus, userRewardClaim),
    };
  }

  private getRewardStatus(
    reward: RewardEntity,
    userStatus: Status,
    claim?: ClaimEntity,
  ): RewardStatus {
    let status = RewardStatus.AlmostThere;
    const { pointsAmount, nextStatus } = userStatus;

    if (nextStatus && reward.cost > nextStatus.cost) {
      status = RewardStatus.AlmostThere;
    }

    if (reward.cost < pointsAmount) {
      status = RewardStatus.Unavailable;
    }

    if (nextStatus && reward.cost > nextStatus.cost) {
      status = RewardStatus.Unavailable;
    }

    if (claim) {
      status = this.convertClaimStatusToRewardStatus(claim);
    }

    return status;
  }

  private convertClaimStatusToRewardStatus(claim: ClaimEntity): RewardStatus {
    const claimStatusToRewardStatus: Record<ClaimStatus, RewardStatus> = {
      [ClaimStatus.Claimed]: RewardStatus.Claimed,
      [ClaimStatus.Shipped]: RewardStatus.Shipped,
    };

    return claimStatusToRewardStatus[claim.status];
  }
}
