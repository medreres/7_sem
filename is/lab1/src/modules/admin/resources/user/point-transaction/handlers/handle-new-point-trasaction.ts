import { ActionHandler, NoticeMessage } from 'adminjs';

import { CreatePointTransactionParams } from '../../../../../point-transaction/types/create-point-transaction.js';
import { handleErrors } from '../../../../utils/errors/handle-errors.js';
import { hasErrors } from '../../../../utils/errors/has-errors.js';
import { createPointTransaction } from '../api/create-point-transaction.js';
import { POINT_TRANSACTION_RESOURCE_ID } from '../point-transaction.resource.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- adminjs types problem
export const handleNewPointTransaction: ActionHandler<any> = async (
  request,
  _response,
  context,
) => {
  const { h } = context;

  const payload = request.payload as CreatePointTransactionParams;

  const response = await createPointTransaction(request, payload);

  if (hasErrors(response)) {
    return handleErrors(response);
  }

  return {
    notice: {
      message: 'Point transaction has been created successfully!',
      type: 'success',
    } satisfies NoticeMessage,
    record: {
      params: response,
    },
    redirectUrl: h.listUrl(POINT_TRANSACTION_RESOURCE_ID),
  };
};
