import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { CryptoService } from '../../crypto/crypto.service.js';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class UserGuard implements CanActivate {
  private logger: Logger = new Logger(UserGuard.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const { accessToken } = request.cookies as { accessToken?: string };

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const { id } = this.cryptoService.parseToken(accessToken);

      const user = await this.userService.getUserByIdOrFail(id);

      if (!user.isActive) {
        throw new UnauthorizedException();
      }

      request.user = user;

      return true;
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException();
    }
  }
}
