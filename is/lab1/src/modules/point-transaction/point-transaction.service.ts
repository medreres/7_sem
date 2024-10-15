import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PointTransactionEntity } from './entities/point-transaction.entity.js';
import { PointTransactionEvent } from './events/constants.js';
import { DeletePointTransactionEvent } from './events/delete-point-transaction.event.js';
import { NewPointTransactionEvent } from './events/new-point-transaction.event.js';
import { CreatePointTransactionParams } from './types/create-point-transaction.js';
import { createNewPointTransactionContent } from './utils/create-new-point-transactioncontent.js';

import { NotificationEvent } from '../notification/events/constants.js';
import { SendNotificationEvent } from '../notification/events/send-notification.event.js';

@Injectable()
export class PointTransactionService {
  private logger = new Logger(PointTransactionService.name);

  constructor(
    @InjectRepository(PointTransactionEntity)
    private readonly pointTransactionRepository: Repository<PointTransactionEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getPointTransactionByIdOrFail(
    transactionId: number,
  ): Promise<PointTransactionEntity> {
    return this.pointTransactionRepository.findOneOrFail({
      where: { id: transactionId },
      relations: {
        invoice: true,
      },
    });
  }

  async createPointTransaction(
    params: CreatePointTransactionParams,
  ): Promise<PointTransactionEntity> {
    this.logger.debug('Creating new point transaction', params);
    const transaction = await this.pointTransactionRepository.save(params);

    this.eventEmitter.emit(
      NotificationEvent.SendNotification,
      new SendNotificationEvent({
        userId: params.userId,
        content: createNewPointTransactionContent(transaction),
      }),
    );

    await this.eventEmitter.emitAsync(
      PointTransactionEvent.NewTransaction,
      new NewPointTransactionEvent({ userId: params.userId }),
    );

    return transaction;
  }

  async deletePointTransaction(
    transactionId: number,
  ): Promise<PointTransactionEntity> {
    this.logger.debug('Deleting point transaction', { transactionId });

    const pointTransaction =
      await this.getPointTransactionByIdOrFail(transactionId);

    await this.pointTransactionRepository.delete(transactionId);

    await this.eventEmitter.emitAsync(
      PointTransactionEvent.DeleteTransaction,
      new DeletePointTransactionEvent({
        pointTransaction,
      }),
    );

    return pointTransaction;
  }
}
