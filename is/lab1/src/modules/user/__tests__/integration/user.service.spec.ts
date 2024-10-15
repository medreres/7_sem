import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { subDays, subHours } from 'date-fns';

import { userStatuses } from '../../../../../scripts/seeds/create-user-status.js';
import {
  createNewSchema,
  dropSchema,
} from '../../../common/__tests__/integration/utils/schema.js';
import { MockedCryptoService } from '../../../crypto/__tests__/__mocks__/crypto.service.mock.js';
import { CryptoModule } from '../../../crypto/crypto.module.js';
import { CryptoService } from '../../../crypto/crypto.service.js';
import { DbModule } from '../../../db/db.module.js';
import { PointTransactionModule } from '../../../point-transaction/point-transaction.module.js';
import { PointTransactionService } from '../../../point-transaction/point-transaction.service.js';
import { RewardModule } from '../../../reward/reward.module.js';
import { UserStatusEntity } from '../../entities/user-status.entity.js';
import { UserModule } from '../../user.module.js';
import { UserService } from '../../user.service.js';
import { createMockUser } from '../__mocks__/user.mock.js';

describe('User service', () => {
  let schemaName: string;
  let module: TestingModule;
  let userService: UserService;
  let pointTransactionService: PointTransactionService;
  const createdUserStatuses: UserStatusEntity[] = [];

  beforeEach(async () => {
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

      userService = module.get<UserService>(UserService);
      pointTransactionService = module.get<PointTransactionService>(
        PointTransactionService,
      );

      userStatuses.forEach(async (status) => {
        const createdStatus = await userService.createUserStatus(status);

        createdUserStatuses.push(createdStatus);
      });
    } catch (error) {
      console.error(error);
      // * if initialization goes wrong - remove created schema
      await dropSchema(schemaName);
    }
  });
  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Creates new user', async () => {
    const newUser = await userService.createUser(createMockUser());

    expect(newUser).toBeDefined();
  });

  it('Calculates user points correctly', async () => {
    const user = await userService.createUser(createMockUser());

    const transactionAmount = 150;

    await pointTransactionService.createPointTransaction({
      amount: transactionAmount,
      description: 'test',
      userId: user.id,
    });

    const userPointsAmount = await userService.getPointsAmountByUserId(user.id);

    expect(userPointsAmount).toEqual(transactionAmount);
  });

  it('Calculates user points correctly after points reset', async () => {
    const user = await userService.createUser(createMockUser());

    const transactionAmount = 150;

    await pointTransactionService.createPointTransaction({
      amount: transactionAmount,
      description: 'test',
      userId: user.id,
      createdAt: subDays(user.createdAt, 1),
    });

    const userPointsAmount = await userService.getPointsAmountByUserId(user.id);

    expect(userPointsAmount).toEqual(0);
  });

  it('Updates user status from bronze to silver', async () => {
    const silverStatus = createdUserStatuses.find(
      (status) => status.name === userStatuses[1].name,
    )!;

    const user = await userService.createUser(createMockUser());

    await pointTransactionService.createPointTransaction({
      amount: silverStatus.cost,
      description: 'test',
      userId: user.id,
    });

    const updatedUser = await userService.getUserByIdOrFail(user.id);

    expect(updatedUser.status.id).toEqual(silverStatus.id);
  });

  it('Downgrades user status from silver to bronze', async () => {
    const silverStatus = createdUserStatuses.find(
      (status) => status.name === userStatuses[1].name,
    )!;

    const bronzeStatus = createdUserStatuses.find(
      (status) => status.name === userStatuses[0].name,
    )!;

    const user = await userService.createUser(createMockUser());

    await pointTransactionService.createPointTransaction({
      amount: silverStatus.cost,
      description: 'test',
      userId: user.id,
      createdAt: subHours(new Date(), 2),
    });

    await userService.downgradeUsersStatusWithExpiredPoints();

    const updatedUser = await userService.getUserByIdOrFail(user.id);

    expect(updatedUser.status.id).toEqual(bronzeStatus.id);
  });

  it('Resets points for users with balance greater than zero', async () => {
    const pastDate = subHours(new Date(), 2);

    const user = await userService.createUser({
      ...createMockUser(),
      createdAt: pastDate,
      lastResetPointsAt: pastDate,
    });

    await pointTransactionService.createPointTransaction({
      amount: 150,
      description: 'test',
      userId: user.id,
      createdAt: pastDate,
    });

    const ids = await userService.getUserIdsToResetStatus();

    expect(ids).toEqual(expect.arrayContaining([user.id]));
  });

  it('Does not reset points for users with zero balance', async () => {
    const pastDate = subHours(new Date(), 2);

    const user = await userService.createUser({
      ...createMockUser(),
      createdAt: pastDate,
      lastResetPointsAt: pastDate,
    });

    const ids = await userService.getUserIdsToResetStatus();

    expect(ids).not.toEqual(expect.arrayContaining([user.id]));
  });

  it('Does not reset points for users whose points have not expired', async () => {
    const user = await userService.createUser(createMockUser());

    await pointTransactionService.createPointTransaction({
      amount: 150,
      description: 'test',
      userId: user.id,
    });

    const ids = await userService.getUserIdsToResetStatus();

    expect(ids).not.toEqual(expect.arrayContaining([user.id]));
  });
});
