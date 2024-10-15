import { CreateAndSendNotificationParams } from '../types/create-and-send-notification.js';

type Payload = Omit<CreateAndSendNotificationParams, 'userId'> & {
  userIds: number[];
};

export class SendNotificationsEvent {
  constructor(readonly payload: Payload) {}
}
