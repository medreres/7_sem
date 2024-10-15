import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailingEvent } from './events/constants.js';
import { SendHtmlEmailEvent } from './events/send-html-email.even.js';
import { SendPlainEmailEvent } from './events/send-plain-email.event.js';
import { MailingService } from './mailing.service.js';

@Module({
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {
  constructor(private readonly mailingService: MailingService) {}

  @OnEvent(MailingEvent.SendPlainEmail)
  async onSendPlainEmailEvent(event: SendPlainEmailEvent): Promise<void> {
    await this.mailingService.sendPlainEmail(event.payload);
  }

  @OnEvent(MailingEvent.SendHtmlEmail)
  async onSendHtmlEmailEvent(event: SendHtmlEmailEvent): Promise<void> {
    await this.mailingService.sendHtmlEmail(event.payload);
  }
}
