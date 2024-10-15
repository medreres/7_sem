import { NotificationEntity } from '../../notification/entities/notification.entity.js';

export type SendNotificationParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- notification payload
  data: NotificationEntity;
  token: string;
};
