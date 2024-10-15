import { PointTransactionEntity } from '../entities/point-transaction.entity.js';

type Payload = {
  pointTransaction: PointTransactionEntity;
};

export class DeletePointTransactionEvent {
  constructor(readonly payload: Payload) {}
}
