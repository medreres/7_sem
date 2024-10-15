import { InvoiceEntity } from '../../../../invoice/entities/invoice.entity.js';

export type ExtendedInvoice = InvoiceEntity & {
  // * only for showing on show page
  invoice: never;
  userName: string;
  numberOfPoints?: number;
};
