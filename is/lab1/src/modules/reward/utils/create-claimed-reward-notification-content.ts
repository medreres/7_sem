import { NotificationType } from '../../notification/enums/notification-type.enum.js';
import { NotificationContent } from '../../push-notification/types/notification-content.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { RewardEntity } from '../entities/reward.entity.js';

export const createClaimedRewardNotificationContent = (
  reward: RewardEntity,
  _user: UserEntity,
): NotificationContent => {
  return {
    type: NotificationType.RewardClaimed,
    title: 'Reward Has Been Claimed 🎉',
    message: `Congratulations! You\`ve unlocked the ${reward.name} reward for reaching ${reward.cost} lifetime points`,
  };
};
