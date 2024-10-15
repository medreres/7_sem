/* eslint-disable @typescript-eslint/naming-convention -- lib params */

import { ActionRequest } from 'adminjs';

import { ErrorOutput } from '../../common/dto/error.output.js';
import { ExtendedUser } from '../resources/user/user/types.js';
import { getRequestHeaders } from '../utils/get-access-token.js';

export const createUser = async (
  request: ActionRequest,
  user: ExtendedUser,
): Promise<ErrorOutput<ExtendedUser> | ExtendedUser> => {
  const { accessToken, origin } = getRequestHeaders(request);

  const createUserResponse = await fetch(`${origin}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify(user),
  });

  const response =
    (await createUserResponse.json()) as ErrorOutput<ExtendedUser>;

  return response;
};
