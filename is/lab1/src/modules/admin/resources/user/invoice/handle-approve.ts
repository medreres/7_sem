/* eslint-disable @typescript-eslint/require-await -- noop for passing data to custom component */
import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';

export type ApproveInvoicePayload = {
  invoiceId: number;
  pointsAmount: number;
};

export const handleApprove = async (
  _request: ActionRequest,
  _response: unknown,
  context: ActionContext,
): Promise<ActionResponse> => {
  const { record, currentAdmin } = context;

  return {
    record: record?.toJSON(currentAdmin),
  };
};
