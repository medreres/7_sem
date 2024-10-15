import { AttachmentDto } from '../../common/dto/attachment.dto.js';
import { AttachmentEntity } from '../entities/attachment.entity.js';

export class AttachmentAdapter {
  static toDto(entity: AttachmentEntity): AttachmentDto {
    return {
      id: entity.id,
      fileUrl: entity.fileUrl,
    };
  }
}
