import type { Identity } from '../../auth/types/identity.js';

export type JwtPayload = {
  iat: number;
} & Identity;
