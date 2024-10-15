import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from './entities/notification.entity.js';
import { NotificationEvent } from './events/constants.js';
import { SendNotificationEvent } from './events/send-notification.event.js';
import { SendNotificationsEvent } from './events/send-notifications.event.js';
import { NotificationController } from './notification.controller.js';
import { NotificationService } from './notification.service.js';

import { PushNotificationModule } from '../push-notification/push-notification.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    UserModule,
    PushNotificationModule,
  ],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(NotificationEvent.SendNotification)
  async onSendNotification(event: SendNotificationEvent): Promise<void> {
    await this.notificationService.createAndSendNotification(event.payload);
  }

  @OnEvent(NotificationEvent.SendNotifications)
  async onSendNotifications(event: SendNotificationsEvent): Promise<void> {
    await this.notificationService.createAndSendNotifications(event.payload);
  }
}
