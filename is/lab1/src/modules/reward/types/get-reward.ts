import { RewardEntity } from '../entities/reward.entity.js';
import { RewardStatus } from '../enums/reward-status.enum.js';

export type GetRewardParams = {
  rewardId: number;
  userId: number;
};

export type GetRewardReturnType = {
  reward: RewardEntity;
  status: RewardStatus;
};
