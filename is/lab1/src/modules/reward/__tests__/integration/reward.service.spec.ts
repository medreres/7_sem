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
import { PointTransactionModule } from '../../../point-transaction/point-transaction.module.js';
import { PointTransactionService } from '../../../point-transaction/point-transaction.service.js';
import { createMockUser } from '../../../user/__tests__/__mocks__/user.mock.js';
import { UserModule } from '../../../user/user.module.js';
import { UserService } from '../../../user/user.service.js';
import { RewardModule } from '../../reward.module.js';
import { RewardService } from '../../reward.service.js';

describe('Reward service', () => {
  let schemaName: string;
  let module: TestingModule;
  let userService: UserService;
  let pointTransactionService: PointTransactionService;
  let rewardService: RewardService;

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
      rewardService = module.get<RewardService>(RewardService);
      pointTransactionService = module.get<PointTransactionService>(
        PointTransactionService,
      );

      userStatuses.forEach(async (status) => {
        await userService.createUserStatus(status);
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

  it('Cannot claim reward that has been created recently with cost lower than user points amount', async () => {
    const user = await userService.createUser(createMockUser());

    const firstRewardCost = 100;
    const secondRewardCost = firstRewardCost / 2;

    const firstReward = await rewardService.createReward({
      cost: firstRewardCost,
      description: 'test',
      name: 'firstReward',
      isHidden: false,
    });

    await pointTransactionService.createPointTransaction({
      userId: user.id,
      amount: firstRewardCost,
      description: 'test',
    });

    const secondReward = await rewardService.createReward({
      cost: secondRewardCost,
      description: 'test',
      name: 'secondReward',
    });

    await pointTransactionService.createPointTransaction({
      userId: user.id,
      amount: secondRewardCost,
      description: 'test',
    });

    const claims = await rewardService.getClaimsByUserId(user.id);

    expect(claims).not.toContainEqual(
      expect.objectContaining({ id: secondReward.id }),
    );

    expect(claims).toContainEqual(
      expect.objectContaining({ id: firstReward.id }),
    );
  });

  it('Cannot claim reward with lower cost that current points amount when rewards have been claimed previously', async () => {
    const user = await userService.createUser(createMockUser());

    const firstRewardCost = 100;
    const secondRewardCost = firstRewardCost * 2;
    const thirdRewardCost = firstRewardCost / 2;

    const firstReward = await rewardService.createReward({
      cost: firstRewardCost,
      description: 'test',
      name: 'firstReward',
      isHidden: false,
    });

    await pointTransactionService.createPointTransaction({
      userId: user.id,
      amount: firstRewardCost,
      description: 'test',
    });

    const secondReward = await rewardService.createReward({
      cost: secondRewardCost,
      description: 'test',
      name: 'secondReward',
    });

    await pointTransactionService.createPointTransaction({
      userId: user.id,
      amount: secondRewardCost,
      description: 'test',
    });

    const thirdReward = await rewardService.createReward({
      cost: thirdRewardCost,
      description: 'test',
      name: 'thirdReward',
    });

    await pointTransactionService.createPointTransaction({
      userId: user.id,
      amount: thirdRewardCost,
      description: 'test',
    });

    const claims = await rewardService.getClaimsByUserId(user.id);

    expect(claims).not.toContainEqual(
      expect.objectContaining({ id: thirdReward.id }),
    );

    expect(claims).toContainEqual(
      expect.objectContaining({ id: firstReward.id }),
    );
    expect(claims).toContainEqual(
      expect.objectContaining({ id: secondReward.id }),
    );
  });

  it('Cannot claim hidden reward', async () => {
    const user = await userService.createUser(createMockUser());

    const rewardCost = 100;

    const reward = await rewardService.createReward({
      cost: rewardCost,
      description: 'test',
      name: 'firstReward',
      isHidden: true,
    });

    await pointTransactionService.createPointTransaction({
      userId: user.id,
      amount: rewardCost,
      description: 'test',
    });
    const claims = await rewardService.getClaimsByUserId(user.id);

    expect(claims).not.toContainEqual(
      expect.objectContaining({ id: reward.id }),
    );
  });
});
