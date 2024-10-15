import { NotificationType } from '../../notification/enums/notification-type.enum.js';

export type NotificationContent = {
  message: string;
  title: string;
  type: NotificationType;
};
