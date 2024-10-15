import { CreateAndSendNotificationParams } from '../types/create-and-send-notification.js';

export class SendNotificationEvent {
  constructor(readonly payload: CreateAndSendNotificationParams) {}
}
