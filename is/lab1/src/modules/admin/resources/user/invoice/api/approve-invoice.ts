import { ApproveInvoiceParams } from '../../../../../invoice/types/approve-invoice-params.js';

export const approveInvoice = async (
  params: ApproveInvoiceParams,
): Promise<void> => {
  await fetch(`/invoices/${params.invoiceId}/approve`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
