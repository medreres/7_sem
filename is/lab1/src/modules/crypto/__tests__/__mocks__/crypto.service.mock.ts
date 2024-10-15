import { jest } from '@jest/globals';

import { CryptoService } from '../../../../modules/crypto/crypto.service.js';

export class MockedCryptoService
  implements Pick<CryptoService, 'hashPassword'>
{
  hashPassword = jest.fn<CryptoService['hashPassword']>((value) =>
    Promise.resolve(value),
  );
}
