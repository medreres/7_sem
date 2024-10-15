import { Global, Logger, Module } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controllers/user.controller.js';
import { UserAdminController } from './controllers/user-admin.controller.js';
import { UserEntity } from './entities/user.entity.js';
import { UserStatusEntity } from './entities/user-status.entity.js';
import { UserService } from './user.service.js';

import { lifetimePointsConfig } from '../config/lifetime-points.js';
import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { PointTransactionEvent } from '../point-transaction/events/constants.js';
import { DeletePointTransactionEvent } from '../point-transaction/events/delete-point-transaction.event.js';
import { NewPointTransactionEvent } from '../point-transaction/events/new-point-transaction.event.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserStatusEntity,
      PointTransactionEntity,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController, UserAdminController],
})
export class UserModule {
  private logger = new Logger(UserModule.name);

  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(lifetimePointsConfig.lifetimePointsCronTime)
  async sendPointsExpiryNotification(): Promise<void> {
    await this.userService.sendPointsExpiryNotification();
  }

  @Cron(lifetimePointsConfig.lifetimePointsCronTime)
  async downgradeUsersStatusWithExpiredPoints(): Promise<void> {
    await this.userService.downgradeUsersStatusWithExpiredPoints();
  }

  // * async and promisify are used to make execution in order
  @OnEvent(PointTransactionEvent.NewTransaction, {
    async: true,
    promisify: true,
  })
  async onNewPointTransactionEvent(
    event: NewPointTransactionEvent,
  ): Promise<void> {
    await this.userService.updateUserStatusIfPossible(event);
  }

  // * async and promisify are used to make execution in order
  @OnEvent(PointTransactionEvent.DeleteTransaction, {
    async: true,
    promisify: true,
  })
  async oneDeletePointTransactionEvent(
    event: DeletePointTransactionEvent,
  ): Promise<void> {
    await this.userService.downgradeUserStatusIfPossible(event);
  }
}
