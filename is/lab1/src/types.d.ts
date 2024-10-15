// src/types.d.ts

import { User } from './modules/user/types/user.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user: Omit<User, 'status'>;
  }
}
