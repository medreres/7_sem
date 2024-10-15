import { RewardWithStatus } from './reward-with-status.js';

import { PageOptions } from '../../common/types/page-options.js';

export type GetPaginatedRewardsParams = {
  userId: number;
} & PageOptions;

export type GetPaginatedRewardsReturnType = {
  itemsCount: number;
  rewards: RewardWithStatus[];
};
