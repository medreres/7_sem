import { InvoiceEntity } from '../entities/invoice.entity.js';

export type UpdateInvoiceParams = {
  id: number;
  fileName?: string;
} & Partial<Pick<InvoiceEntity, 'status'>>;
