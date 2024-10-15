import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import { JwtPayload } from './types/jwt.js';

import { ONE_SECOND_IN_MS } from '../common/constants.js';
import { authConfig } from '../config/auth.js';
import { User } from '../user/types/user.js';

@Injectable()
export class CryptoService {
  hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  verifyPassword(
    passwordToVerify: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, passwordToVerify);
  }

  generateToken(user: User): string {
    const { role, id, isActive } = user;

    const payload: JwtPayload = {
      id,
      role,
      isActive,
      iat: Math.floor(Date.now() / ONE_SECOND_IN_MS),
    };

    // TODO add expiration
    const token = jwt.sign(payload, authConfig.accessTokenSecret) as string;

    return token;
  }

  parseToken(token: string): JwtPayload {
    const payload = jwt.verify(
      token,
      authConfig.accessTokenSecret,
    ) as JwtPayload;

    return payload;
  }
}
