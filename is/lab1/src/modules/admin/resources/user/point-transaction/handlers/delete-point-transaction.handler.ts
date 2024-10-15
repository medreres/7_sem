import { ActionHandler, NoticeMessage } from 'adminjs';

import { handleErrors } from '../../../../utils/errors/handle-errors.js';
import { hasErrors } from '../../../../utils/errors/has-errors.js';
import { deletePointTransaction } from '../api/delete-point-transaction.js';
import { POINT_TRANSACTION_RESOURCE_ID } from '../point-transaction.resource.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- adminjs types problem
export const handleDeletePointTransaction: ActionHandler<any> = async (
  request,
  _response,
  context,
) => {
  const { h, record, currentAdmin } = context;

  const pointTransactionId = request.params.recordId;

  const response = await deletePointTransaction(request, {
    pointTransactionId: Number(pointTransactionId),
  });

  if (hasErrors(response)) {
    return handleErrors(response);
  }

  return {
    notice: {
      message: 'Transaction has been deleted successfully!',
      type: 'success',
    } satisfies NoticeMessage,
    record: record?.toJSON(currentAdmin),
    redirectUrl: h.listUrl(POINT_TRANSACTION_RESOURCE_ID),
  };
};
