import { AuthenticatePayload, CurrentAdmin } from 'adminjs';

import { fetchIdentity } from './api/fetchIdentity.js';
import { login } from './api/login.js';
import { logger } from './logger.js';

import { ExpressContext } from '../../modules/common/types/index.js';
import { LoginInput } from '../auth/dto/login/input.dto.js';
import { UserRole } from '../user/enums/user-status.enum.js';

export const authenticate = async (
  payload: AuthenticatePayload,
  ctx: ExpressContext,
): Promise<CurrentAdmin | null> => {
  const { email, password } = payload as LoginInput;
  const { req } = ctx;

  try {
    const { accessToken } = await login(req, email, password);
    const identity = await fetchIdentity(req, accessToken);

    if (identity.role !== UserRole.Admin) {
      logger.error(`User with id ${identity.id} tried to access admin panel`);

      throw new Error('Wrong password or email');
    }

    // * set cookie so that we can call endpoints from server
    ctx.res.cookie('accessToken', accessToken);

    const { id } = identity;

    return {
      id: id.toString(),
      email,
    };
  } catch (error) {
    logger.error('error', error);

    return null;
  }
};
