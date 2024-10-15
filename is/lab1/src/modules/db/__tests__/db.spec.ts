import { beforeEach, describe } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import {
  createNewSchema,
  dropSchema,
} from '../../common/__tests__/integration/utils/schema.js';
import { DbModule } from '../db.module.js';

describe('Database service', () => {
  let schemaName: string;
  let module: TestingModule;

  beforeEach(async () => {
    // TODO can abstract away creating testing module
    const { schema } = await createNewSchema();

    schemaName = schema;

    try {
      module = await Test.createTestingModule({
        imports: [DbModule.forTest(schemaName)],
      }).compile();
    } catch (error) {
      // * if initialization goes wrong - remove created schema
      await dropSchema(schemaName);
    }
  });

  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Connects to newly created schema', async () => {
    // if no error then module is initialized and connection is established
  });
});
