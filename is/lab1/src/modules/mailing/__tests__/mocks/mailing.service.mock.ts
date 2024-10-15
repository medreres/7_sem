import { jest } from '@jest/globals';

import { MailingService } from '../../mailing.service.js';

export const MockedMailingServiceClass: Pick<
  MailingService,
  'sendHtmlEmail' | 'sendPlainEmail'
> = {
  sendHtmlEmail: jest.fn<MailingService['sendHtmlEmail']>(),

  sendPlainEmail: jest.fn<MailingService['sendPlainEmail']>(),
};
