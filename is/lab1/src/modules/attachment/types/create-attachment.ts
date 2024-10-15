import { AttachmentResource } from './attachment-resource.js';

import { AttachmentEntity } from '../entities/attachment.entity.js';

export type CreateAttachmentParams = AttachmentResource &
  Pick<AttachmentEntity, 'fileUrl'>;
