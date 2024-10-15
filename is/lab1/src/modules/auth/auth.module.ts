import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module.js';

import { UserModule } from '../user/user.module.js';

@Module({
  imports: [UserModule, ResetPasswordModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
