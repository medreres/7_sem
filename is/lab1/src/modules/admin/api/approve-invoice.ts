import { ActionProps } from 'adminjs';

import { ApproveInvoicePayload } from '../resources/user/invoice/handle-approve.js';

export const approveInvoice = async (
  params: ApproveInvoicePayload,
  props: ActionProps,
): Promise<void> => {
  await fetch(`/admin/api/resources/${props.resource.id}/actions/approve`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'json',
    },
  });
};
