/* eslint-disable eslint-comments/require-description -- mock */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import { Request } from 'express';

import { UserDto } from '../../user/dto/user.dto.js';
import { logger } from '../logger.js';
import { getRequestDestinationBaseUrl } from '../utils/http.js';

export const fetchIdentity = async (
  req: Request,
  accessToken: string,
): Promise<UserDto> => {
  logger.debug('Logging to admin panel...');

  const meResponse = await fetch(
    `${getRequestDestinationBaseUrl(req)}/users/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );

  if (meResponse.status !== 200) {
    logger.debug(await meResponse.json());

    throw new Error('Unauthenticated');
  }

  const userData: UserDto = await meResponse.json();

  return userData;
};
