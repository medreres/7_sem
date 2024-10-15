import { jest } from '@jest/globals';
import { Repository } from 'typeorm';

import { ResetPasswordCodeEntity } from '../../../../entities/resset-password.entity.js';

export const MockedResetPasswordRepositoryClass = {
  save: jest.fn<Repository<ResetPasswordCodeEntity>['save']>(),
};
