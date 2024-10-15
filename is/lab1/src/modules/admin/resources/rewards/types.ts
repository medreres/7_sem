import { RewardEntity } from '../../../reward/entities/reward.entity.js';

export type ExtendedReward = RewardEntity & {
  imageUrl?: string;
};
