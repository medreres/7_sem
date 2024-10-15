import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MockedMailingServiceClass } from '../../../../../mailing/__tests__/mocks/mailing.service.mock.js';
import { MailingModule } from '../../../../../mailing/mailing.module.js';
import { MailingService } from '../../../../../mailing/mailing.service.js';
import { createMockUser } from '../../../../../user/__tests__/__mocks__/user.mock.js';
import { ResetPasswordCodeEntity } from '../../../../entities/resset-password.entity.js';
import { ResetPasswordService } from '../../reset-password.service.js';
import { MockedResetPasswordRepositoryClass } from '../mocks/reset-password.repository.js';

describe('Reset password service', () => {
  let module: TestingModule;
  let resetPasswordService: ResetPasswordService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot(), MailingModule],
      providers: [
        {
          provide: getRepositoryToken(ResetPasswordCodeEntity),
          useValue: MockedResetPasswordRepositoryClass,
        },
        ResetPasswordService,
      ],
    })
      .overrideProvider(MailingService)
      .useValue(MockedMailingServiceClass)
      .compile();

    await module.init();

    resetPasswordService =
      module.get<ResetPasswordService>(ResetPasswordService);
  });

  it('Triggers sending email and saves entity', async () => {
    await resetPasswordService.sendResetPasswordCode(createMockUser());

    // * passing event is async, wait a bit for callback to have been called
    await new Promise<void>((res) => {
      setTimeout(res, 1500);
    });

    expect(MockedResetPasswordRepositoryClass.save).toHaveBeenCalled();

    expect(MockedMailingServiceClass.sendPlainEmail).toHaveBeenCalled();
  });
});
