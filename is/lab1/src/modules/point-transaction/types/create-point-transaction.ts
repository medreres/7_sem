import { PointTransactionEntity } from '../entities/point-transaction.entity.js';

export type CreatePointTransactionParams = Pick<
  PointTransactionEntity,
  'userId' | 'amount' | 'description' | 'invoiceId'
> &
  Partial<Pick<PointTransactionEntity, 'createdAt'>>;
