import { RejectInvoiceParams } from '../../../../../invoice/types/reject-invoice-params.js';

export const rejectInvoice = async (
  params: RejectInvoiceParams,
): Promise<void> => {
  await fetch(`/invoices/${params.invoiceId}/reject`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
