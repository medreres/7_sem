import { ActionRequest } from 'adminjs';

import { ErrorOutput } from '../../../../../common/dto/error.output.js';
import { PointTransactionDto } from '../../../../../point-transaction/dto/point-transaction.dto.js';
import { getRequestHeaders } from '../../../../utils/get-access-token.js';

export type DeletePointTransactionParams = {
  pointTransactionId: number;
};

export const deletePointTransaction = async (
  request: ActionRequest,
  params: DeletePointTransactionParams,
): Promise<ErrorOutput | PointTransactionDto> => {
  const { accessToken, origin } = getRequestHeaders(request);
  const { pointTransactionId } = params;

  const response = await fetch(
    `${origin}/point-transactions/${pointTransactionId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );

  const createPointTransactionResponse = (await response.json()) as object;

  return createPointTransactionResponse as ErrorOutput | PointTransactionDto;
};
