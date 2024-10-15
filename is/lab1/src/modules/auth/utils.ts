import jwt from 'jsonwebtoken';

import { Identity } from './types/identity.js';

import { appConfig } from '../config/app.js';
import { User } from '../user/types/user.js';

type JwtPayload = {
  iat: number;
} & Identity;

const ONE_SECOND_IN_MS = 1000;

export const generateToken = (user: User): string => {
  const { role, id, isActive } = user;

  const payload: JwtPayload = {
    id,
    role,
    isActive,
    iat: Math.floor(Date.now() / ONE_SECOND_IN_MS),
  };

  const token = jwt.sign(payload, appConfig.accessTokenSecret) as string;

  return token;
};

export const parseToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, appConfig.accessTokenSecret) as JwtPayload;

  return payload;
};
