import { AttachmentEntity } from '../entities/attachment.entity.js';

export type AttachmentResource = Pick<
  AttachmentEntity,
  'categoryId' | 'invoiceId' | 'productId' | 'rewardId'
>;
