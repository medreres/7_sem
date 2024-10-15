import { ActionRequest } from 'adminjs';

import { ErrorOutput } from '../../../../../common/dto/error.output.js';
import { PointTransactionDto } from '../../../../../point-transaction/dto/point-transaction.dto.js';
import { CreatePointTransactionParams } from '../../../../../point-transaction/types/create-point-transaction.js';
import { getRequestHeaders } from '../../../../utils/get-access-token.js';

export const createPointTransaction = async (
  request: ActionRequest,
  params: CreatePointTransactionParams,
): Promise<ErrorOutput | PointTransactionDto> => {
  const { accessToken, origin } = getRequestHeaders(request);

  const response = await fetch(`${origin}/point-transactions`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`,
    },
  });

  const createPointTransactionResponse = (await response.json()) as object;

  return createPointTransactionResponse as ErrorOutput | PointTransactionDto;
};
