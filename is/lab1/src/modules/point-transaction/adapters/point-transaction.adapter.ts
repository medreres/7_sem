import { PointTransactionDto } from '../dto/point-transaction.dto.js';
import { PointTransactionEntity } from '../entities/point-transaction.entity.js';

export class PointTransactionAdapter {
  static toDto(entity: PointTransactionEntity): PointTransactionDto {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      description: entity.description,
    };
  }
}
