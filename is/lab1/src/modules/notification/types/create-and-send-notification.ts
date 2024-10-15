import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { NotificationContent } from '../../push-notification/types/notification-content.js';

export type CreateAndSendNotificationParams = {
  content: NotificationContent;
  userId: number;
  attachments?: AttachmentEntity[];
};
