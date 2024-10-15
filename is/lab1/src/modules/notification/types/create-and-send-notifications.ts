import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { NotificationContent } from '../../push-notification/types/notification-content.js';

export type CreateAndSendNotificationsParams = {
  content: NotificationContent;
  userIds: number[];
  attachments?: AttachmentEntity[];
};
