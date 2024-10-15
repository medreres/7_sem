import { Module } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResetPasswordService } from './reset-password.service.js';

import { ResetPasswordCodeEntity } from '../../entities/resset-password.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordCodeEntity])],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Cron(CronExpression.EVERY_WEEK)
  cleanupResetCodes(): void {
    void this.resetPasswordService.removeExpiredVerificationCodes();
  }
}
