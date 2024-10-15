import { AttachmentAdapter } from '../../attachment/adapters/attachment.adapter.js';
import { InvoiceDto } from '../dtos/invoice.dto.js';
import { InvoiceEntity } from '../entities/invoice.entity.js';

export class InvoiceAdapter {
  static toDto(entity: InvoiceEntity): InvoiceDto {
    const attachment = entity.attachments?.at(0);

    const invoiceUrl = attachment
      ? AttachmentAdapter.toDto(attachment).fileUrl
      : undefined;

    return {
      id: entity.id,
      status: entity.status,
      rejectionReason: entity.rejectionReason,
      invoiceUrl,
    };
  }
}
