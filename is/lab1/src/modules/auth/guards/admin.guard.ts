import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { CryptoService } from '../../crypto/crypto.service.js';
import { UserRole } from '../../user/enums/user-status.enum.js';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class AdminGuard implements CanActivate {
  private logger: Logger = new Logger(AdminGuard.name);

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

      if (!id) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.getUserByIdOrFail(id);

      if (!user.isActive) {
        throw new UnauthorizedException();
      }

      if (user.role !== UserRole.Admin) {
        throw new ForbiddenException();
      }

      request.user = user;

      return true;
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException();
    }
  }
}
