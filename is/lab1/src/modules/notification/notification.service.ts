import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity } from './entities/notification.entity.js';
import { NotificationStatus } from './enums/notification-status.enum.js';
import { CreateAndSendNotificationParams } from './types/create-and-send-notification.js';
import { CreateAndSendNotificationsParams } from './types/create-and-send-notifications.js';
import { DeleteNotificationParams } from './types/delete-notification.js';
import { GetNotificationParams } from './types/get-notification.js';
import {
  GetPaginatedNotificationsByUserIdParams,
  GetPaginatedNotificationsByUserIdReturnType,
} from './types/get-paginated-notifications-by-user-id.js';
import { MarkAsReadParams } from './types/mark-as-read.js';

import { PushNotificationService } from '../push-notification/push-notification.service.js';
import { UserService } from '../user/user.service.js';

export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly pushNotificationService: PushNotificationService,
    private readonly userService: UserService,
  ) {}

  async getPaginatedNotificationsByUserId(
    params: GetPaginatedNotificationsByUserIdParams,
  ): Promise<GetPaginatedNotificationsByUserIdReturnType> {
    const { userId, page, take } = params;

    const [notifications, itemsCount] =
      await this.notificationRepository.findAndCount({
        where: { userId },
        relations: { attachments: true },
        order: { createdAt: 'DESC' },
        take,
        skip: (page - 1) * take,
      });

    return { notifications, itemsCount };
  }

  async getUnreadNotificationsCountByUserId(userId: number): Promise<number> {
    const count = await this.notificationRepository.count({
      where: { userId, status: NotificationStatus.Sent },
    });

    return count;
  }

  async getNotification(
    params: GetNotificationParams,
  ): Promise<NotificationEntity> {
    const { notificationId, userId } = params;

    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: { attachments: true },
    });

    if (!notification) {
      throw new BadRequestException('Notification with provided id not found.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Notification does not belong to the user.');
    }

    return notification;
  }

  async markNotificationAsRead(params: MarkAsReadParams): Promise<boolean> {
    const { notificationId, userId } = params;

    await this.notificationRepository.update(
      { id: notificationId, userId },
      {
        status: NotificationStatus.Read,
      },
    );

    return true;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    await this.notificationRepository.update(
      { userId },
      {
        status: NotificationStatus.Read,
      },
    );

    return true;
  }

  async deleteNotification(params: DeleteNotificationParams): Promise<boolean> {
    const { notificationId, userId } = params;

    await this.notificationRepository.delete({ id: notificationId, userId });

    return true;
  }

  async createAndSendNotification(
    params: CreateAndSendNotificationParams,
  ): Promise<boolean> {
    const user = await this.userService.getUserByIdOrFail(params.userId);

    const notification = await this.createNotification(params);

    if (user.deviceToken) {
      await this.pushNotificationService.sendNotification({
        token: user.deviceToken,
        data: notification,
      });
    }

    return true;
  }

  async createAndSendNotifications(
    params: CreateAndSendNotificationsParams,
  ): Promise<boolean> {
    const { userIds, content, attachments } = params;

    const usersIdWithDeviceToken =
      await this.userService.getUsersDeviceTokenByIds(userIds);

    const userIdToNotification: Record<number, NotificationEntity> = {};

    await Promise.all(
      usersIdWithDeviceToken.map(async ({ id }) => {
        const notification = await this.createNotification({
          content,
          userId: id,
          attachments,
        });

        userIdToNotification[id] = notification;
      }),
    );

    await Promise.all(
      usersIdWithDeviceToken.map(async ({ deviceToken, id }) => {
        if (!deviceToken || !userIdToNotification[id]) {
          return;
        }

        await this.pushNotificationService.sendNotification({
          token: deviceToken,
          data: userIdToNotification[id],
        });
      }),
    );

    return true;
  }

  private async createNotification(
    params: CreateAndSendNotificationParams,
  ): Promise<NotificationEntity> {
    const { content, userId, attachments = [] } = params;

    const saveNotification = new NotificationEntity();

    saveNotification.title = content.title;
    saveNotification.message = content.message;
    saveNotification.status = NotificationStatus.Sent;
    saveNotification.type = content.type;
    saveNotification.userId = userId;
    saveNotification.attachments = attachments;

    const notification =
      await this.notificationRepository.save(saveNotification);

    return notification;
  }
}
