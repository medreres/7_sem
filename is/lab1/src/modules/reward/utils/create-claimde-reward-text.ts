import { RewardEntity } from '../entities/reward.entity.js';

export const createClaimedRewardText = (reward: RewardEntity): string => {
  return `Congratulations!
You have claimed reward ${reward.id} ${reward.name}
Cost: ${reward.cost}
Description: ${reward.description}
Term of use: ${reward.termOfUse ?? 'None'}
`;
};
