import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SendContactUsEmailParams } from './types/send-contact-us-email.js';

import { appConfig } from '../config/app.js';
import { MailingEvent } from '../mailing/events/constants.js';
import { SendPlainEmailEvent } from '../mailing/events/send-plain-email.event.js';

@Injectable()
export class SupportService {
  private supportEmail = appConfig.supportEmail;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async sendContactUsEmail(params: SendContactUsEmailParams): Promise<void> {
    try {
      const body = this.prepareContactUsEmailBody(params);

      void this.eventEmitter.emit(
        MailingEvent.SendPlainEmail,
        new SendPlainEmailEvent({
          recipients: [this.supportEmail],
          body,
          subject: 'Message for Support Team',
        }),
      );

      await Promise.resolve();
    } catch (error) {
      throw new InternalServerErrorException('Error when sending email');
    }
  }

  private prepareContactUsEmailBody(params: SendContactUsEmailParams): string {
    const { name, message, email } = params;

    return `Hi Support Team.\n\nYou have received a new message from: ${name}. More details below:\n\nMessage: ${message}\n\nReply to email: ${email}`;
  }
}
