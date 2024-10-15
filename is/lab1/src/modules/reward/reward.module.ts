import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClaimController } from './controllers/claim.controller.js';
import { ClaimEntity } from './entities/claim.entity.js';
import { RewardEntity } from './entities/reward.entity.js';
import { RewardController } from './reward.controller.js';
import { RewardService } from './reward.service.js';

import { NotificationModule } from '../notification/notification.module.js';
import { PointTransactionEvent } from '../point-transaction/events/constants.js';
import { DeletePointTransactionEvent } from '../point-transaction/events/delete-point-transaction.event.js';
import { NewPointTransactionEvent } from '../point-transaction/events/new-point-transaction.event.js';
import { PointTransactionModule } from '../point-transaction/point-transaction.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardEntity, ClaimEntity]),
    UserModule,
    NotificationModule,
    PointTransactionModule,
  ],
  providers: [RewardService],
  exports: [RewardService],
  controllers: [RewardController, ClaimController],
})
export class RewardModule {
  constructor(private readonly rewardService: RewardService) {}

  @OnEvent(PointTransactionEvent.NewTransaction, {
    async: true,
    promisify: true,
  })
  async onNewPointTransactionEvent(
    event: NewPointTransactionEvent,
  ): Promise<void> {
    await this.rewardService.claimAvailableRewards(event.payload.userId);
  }

  @OnEvent(PointTransactionEvent.DeleteTransaction, {
    async: true,
    promisify: true,
  })
  async onDeletePointTransactionEvent(
    event: DeletePointTransactionEvent,
  ): Promise<void> {
    await this.rewardService.disclaimUnavailableRewards(
      event.payload.pointTransaction,
    );
  }
}
