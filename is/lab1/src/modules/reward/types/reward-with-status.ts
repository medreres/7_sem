import { RewardEntity } from '../entities/reward.entity.js';
import { RewardStatus } from '../enums/reward-status.enum.js';

export type RewardWithStatus = {
  reward: RewardEntity;
  status: RewardStatus;
};
