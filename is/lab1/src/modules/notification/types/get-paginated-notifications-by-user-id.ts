import { PageOptions } from '../../common/types/page-options.js';
import { NotificationEntity } from '../entities/notification.entity.js';

export type GetPaginatedNotificationsByUserIdParams = {
  userId: number;
} & PageOptions;

export type GetPaginatedNotificationsByUserIdReturnType = {
  itemsCount: number;
  notifications: NotificationEntity[];
};
