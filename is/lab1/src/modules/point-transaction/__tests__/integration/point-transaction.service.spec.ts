import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { userStatuses } from '../../../../../scripts/seeds/create-user-status.js';
import {
  createNewSchema,
  dropSchema,
} from '../../../common/__tests__/integration/utils/schema.js';
import { MockedCryptoService } from '../../../crypto/__tests__/__mocks__/crypto.service.mock.js';
import { CryptoModule } from '../../../crypto/crypto.module.js';
import { CryptoService } from '../../../crypto/crypto.service.js';
import { DbModule } from '../../../db/db.module.js';
import { RewardModule } from '../../../reward/reward.module.js';
import { createMockUser } from '../../../user/__tests__/__mocks__/user.mock.js';
import { UserModule } from '../../../user/user.module.js';
import { UserService } from '../../../user/user.service.js';
import { PointTransactionModule } from '../../point-transaction.module.js';
import { PointTransactionService } from '../../point-transaction.service.js';

describe('Point transaction service', () => {
  let schemaName: string;
  let module: TestingModule;
  let pointTransactionService: PointTransactionService;
  let userService: UserService;

  beforeAll(async () => {
    // TODO can abstract away creating testing module
    const { schema } = await createNewSchema();

    schemaName = schema;

    try {
      module = await Test.createTestingModule({
        imports: [
          DbModule.forTest(schemaName),
          UserModule,
          PointTransactionModule,
          RewardModule,
          UserModule,
          CryptoModule,
          EventEmitterModule.forRoot(),
        ],
      })
        .overrideProvider(CryptoService)
        .useClass(MockedCryptoService)
        .compile();

      await module.init();

      pointTransactionService = module.get<PointTransactionService>(
        PointTransactionService,
      );
      userService = module.get<UserService>(UserService);

      userStatuses.forEach(async (status) => {
        await userService.createUserStatus(status);
      });
    } catch (error) {
      console.error(error);
      // * if initialization goes wrong - remove created schema
      await dropSchema(schemaName);
    }
  });

  afterAll(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('User is assigned new points', async () => {
    const testUser = await userService.createUser(createMockUser());

    // * assign user exacts points to update status
    const pointsAmount = userStatuses[1].cost;

    await pointTransactionService.createPointTransaction({
      amount: pointsAmount,
      description: 'test',
      userId: testUser.id,
    });

    const userPointsAmount = await userService.getPointsAmountByUserId(
      testUser.id,
    );

    expect(userPointsAmount).toBe(pointsAmount);
  });

  it('User earns new status on new point transaction', async () => {
    const testUser = await userService.createUser(createMockUser());

    // * assign user exacts points to update status
    const newStatus = userStatuses[1];

    await pointTransactionService.createPointTransaction({
      amount: newStatus.cost,
      description: 'test',
      userId: testUser.id,
    });

    const updatedUser = await userService.getUserByIdOrFail(testUser.id);

    expect(updatedUser.status.name).toBe(newStatus.name);
  });

  it('Users can skip intermediate statuses when earning enough points to reach a higher status', async () => {
    const testUser = await userService.createUser(createMockUser());

    // * assign user exacts points to update status
    const newStatus = userStatuses[2];

    await pointTransactionService.createPointTransaction({
      amount: newStatus.cost,
      description: 'test',
      userId: testUser.id,
    });

    const updatedUser = await userService.getUserByIdOrFail(testUser.id);

    expect(updatedUser.status.name).toBe(newStatus.name);
  });

  it('Users can consequently earn new statuses', async () => {
    const testUser = await userService.createUser(createMockUser());

    // * assign user exacts points to update status
    const newStatus = userStatuses[1];

    await pointTransactionService.createPointTransaction({
      amount: newStatus.cost,
      description: 'test',
      userId: testUser.id,
    });

    const updatedUser = await userService.getUserByIdOrFail(testUser.id);

    expect(updatedUser.status.name).toBe(newStatus.name);

    // * assign user exacts points to update status
    const nextNewStatus = userStatuses[1];

    await pointTransactionService.createPointTransaction({
      amount: nextNewStatus.cost,
      description: 'test',
      userId: testUser.id,
    });

    const updatedUserWithNextNewStatus = await userService.getUserByIdOrFail(
      testUser.id,
    );

    expect(updatedUserWithNextNewStatus.status.name).toBe(nextNewStatus.name);
  });

  it('User status is downgraded when point transaction is removed', async () => {
    const testUser = await userService.createUser(createMockUser());

    // * assign user exacts points to update status
    const newStatus = userStatuses[1];

    const { id } = await pointTransactionService.createPointTransaction({
      amount: newStatus.cost,
      description: 'test',
      userId: testUser.id,
    });

    const { status: upgradedStatus } = await userService.getUserByIdOrFail(
      testUser.id,
    );

    expect(upgradedStatus.name).toBe(newStatus.name);

    await pointTransactionService.deletePointTransaction(id);

    const { status: downgradedStatus } = await userService.getUserByIdOrFail(
      testUser.id,
    );

    expect(downgradedStatus.name).toBe(testUser.status.name);
  });

  it('Users can skip intermediate statuses when loosing enough points to reach a lower status', async () => {
    const testUser = await userService.createUser(createMockUser());

    // * assign user exacts points to update status
    const newStatus = userStatuses[2];

    const { id } = await pointTransactionService.createPointTransaction({
      amount: newStatus.cost,
      description: 'test',
      userId: testUser.id,
    });

    const { status: upgradedStatus } = await userService.getUserByIdOrFail(
      testUser.id,
    );

    expect(upgradedStatus.name).toBe(newStatus.name);

    await pointTransactionService.deletePointTransaction(id);

    const { status: downgradedStatus } = await userService.getUserByIdOrFail(
      testUser.id,
    );

    expect(downgradedStatus.name).toBe(testUser.status.name);
  });
});
