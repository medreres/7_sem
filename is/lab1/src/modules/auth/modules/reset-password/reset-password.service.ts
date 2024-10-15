import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { BadRequestException } from '../../../common/exceptions/bad-request.exception.js';
import { authConfig } from '../../../config/auth.js';
import { MailingEvent } from '../../../mailing/events/constants.js';
import { SendPlainEmailEvent } from '../../../mailing/events/send-plain-email.event.js';
import { UserEntity } from '../../../user/entities/user.entity.js';
import { RESET_PASSWORD_CODE_LENGTH } from '../../constants.js';
import { ResetPasswordCodeEntity } from '../../entities/resset-password.entity.js';

@Injectable()
export class ResetPasswordService {
  private logger = new Logger(ResetPasswordService.name);

  constructor(
    @InjectRepository(ResetPasswordCodeEntity)
    private readonly resetPasswordCodeRepository: Repository<ResetPasswordCodeEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async sendResetPasswordCode(user: UserEntity): Promise<void> {
    this.logger.debug('Creating reset password code...');

    const otpCode = this.generatePasswordResetCode();

    await Promise.all([
      this.resetPasswordCodeRepository.save({
        code: otpCode,
        user: { id: user.id },
      }),
      this.eventEmitter.emit(
        MailingEvent.SendPlainEmail,
        new SendPlainEmailEvent({
          body: `Your reset code is ${otpCode}`,
          subject: 'Reset password',
          recipients: [user.email],
        }),
      ),
    ]);

    this.logger.debug('Reset code has been generated');
  }

  async verifyResetPasswordCode(email: string, code: string): Promise<boolean> {
    this.logger.debug('Verifying reset password code...');

    try {
      await this.resetPasswordCodeRepository.findOneOrFail({
        where: {
          code,
          user: { email },
        },
      });

      this.logger.debug('Code is valid');
    } catch (error) {
      throw new BadRequestException({
        field: 'code',
        message: 'Invalid error code',
      });
    }

    return true;
  }

  async removeVerificationCode(userId: number, code: string): Promise<void> {
    await this.resetPasswordCodeRepository.delete({
      code,
      user: { id: userId },
    });
  }

  async removeExpiredVerificationCodes(): Promise<void> {
    this.logger.debug('Cleaning reset codes...');
    await this.resetPasswordCodeRepository.delete({
      createdAt: LessThan(this.getExpiryDate()),
    });
  }

  private getExpiryDate(): Date {
    const date = new Date();

    date.setDate(date.getDate() - authConfig.resetCodeLifeInDays);

    return date;
  }

  /**
   *
   * @description generates random code in format 000000
   * @example '012345'
   */
  generatePasswordResetCode = (): string => {
    const digits = Array.from({ length: RESET_PASSWORD_CODE_LENGTH }).map(
      () => {
        // eslint-disable-next-line no-magic-numbers -- we need digits in range 0-9
        const digit = Math.max(0, Math.random() * 10 - 1);

        return digit.toFixed(0);
      },
    );

    return digits.join('');
  };
}
