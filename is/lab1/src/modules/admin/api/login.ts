/* eslint-disable eslint-comments/require-description -- noop */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import { Request } from 'express';

import { LoginReturnType } from '../../auth/types/login.js';
import { logger } from '../logger.js';
import { getRequestDestinationBaseUrl } from '../utils/http.js';

export const login = async (
  req: Request,
  email: string,
  password: string,
): Promise<LoginReturnType> => {
  const loginResponse = await fetch(
    `${getRequestDestinationBaseUrl(req)}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  if (loginResponse.status !== 200) {
    logger.debug(await loginResponse.json());

    throw new Error('Wrong password or email');
  }

  const response: LoginReturnType = await loginResponse.json();

  return response;
};
