import { Module } from '@nestjs/common';

import { PushNotificationService } from './push-notification.service.js';

@Module({
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
