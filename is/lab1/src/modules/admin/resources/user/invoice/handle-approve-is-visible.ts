import { ActionContext } from 'adminjs';

import { InvoiceEntity } from '../../../../invoice/entities/invoice.entity.js';
import { InvoiceStatus } from '../../../../invoice/enums/invoice-status.enum.js';

export const handleInvoiceActionIsVisible = (
  context: ActionContext,
): boolean => {
  const invoice = context.record?.params as InvoiceEntity | undefined;

  if (invoice?.status !== InvoiceStatus.Open) {
    return false;
  }

  return true;
};
