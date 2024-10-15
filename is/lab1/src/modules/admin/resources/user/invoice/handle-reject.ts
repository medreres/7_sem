/* eslint-disable @typescript-eslint/require-await -- just a noop */
import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';

export type ApproveInvoicePayload = {
  invoiceId: number;
  pointsAmount: number;
};

// * We need this noop just to pass data to reject invoice component
export const handleReject = async (
  _request: ActionRequest,
  _response: unknown,
  context: ActionContext,
): Promise<ActionResponse> => {
  const { record, currentAdmin } = context;

  return {
    record: record?.toJSON(currentAdmin),
  };
};
