import { NotificationType } from '../../notification/enums/notification-type.enum.js';
import { NotificationContent } from '../../push-notification/types/notification-content.js';
import { PointTransactionEntity } from '../entities/point-transaction.entity.js';

export const createNewPointTransactionContent = (
  pointTransaction: PointTransactionEntity,
): NotificationContent => {
  return {
    type: NotificationType.NewPointTransaction,
    title: 'Points Earned! 🎉',
    message: `You've earned ${pointTransaction.amount} lifetime points! Keep it up! Reason: ${pointTransaction.description}`,
  };
};
