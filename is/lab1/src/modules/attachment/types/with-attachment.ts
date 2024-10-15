import { AttachmentEntity } from '../entities/attachment.entity.js';

export abstract class WithAttachment {
  attachments?: AttachmentEntity[];
}
