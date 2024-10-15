import { AttachmentAdapter } from '../../attachment/adapters/attachment.adapter.js';
import { NotificationDto } from '../dto/notification.dto.js';
import { NotificationEntity } from '../entities/notification.entity.js';

export class NotificationAdapter {
  static toDto(entity: NotificationEntity): NotificationDto {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      title: entity.title,
      message: entity.message,
      status: entity.status,
      attachments:
        entity.attachments?.map((attachment) =>
          AttachmentAdapter.toDto(attachment),
        ) ?? [],
    };
  }
}
