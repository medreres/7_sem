import { NotificationType } from '../../notification/enums/notification-type.enum.js';
import { NotificationContent } from '../../push-notification/types/notification-content.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { RewardEntity } from '../entities/reward.entity.js';

export const createShippedRewardNotificationContent = (
  reward: RewardEntity,
  _user: UserEntity,
): NotificationContent => {
  return {
    type: NotificationType.RewardShipped,
    title: 'Reward Has Been Shipped! 🚚',
    message: `Great news! Your ${reward.name} has been shipped.`,
  };
};
