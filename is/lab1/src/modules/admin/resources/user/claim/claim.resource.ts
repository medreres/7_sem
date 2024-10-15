import { targetRelationSettingsFeature } from '@adminjs/relations';

import { handleEditAfter } from './handle-edit-after.js';
import { handleEditIsAccessible } from './handle-edit-is-accessible.js';

import { ClaimEntity } from '../../../../reward/entities/claim.entity.js';
import { Resource } from '../../../types/resource.js';
import { loggerFeatureSetup } from '../../log/feature.js';
import { REWARD_RESOURCE_ID } from '../../rewards/reward.resource.js';
import { navigation } from '../navigation.js';
import { USER_RESOURCE_ID } from '../user/user.resource.js';

export const CLAIM_RESOURCE_ID = 'Claims';

export const createClaimResource = (): Resource<ClaimEntity> => ({
  resource: ClaimEntity,
  options: {
    navigation,
    id: CLAIM_RESOURCE_ID,
    sort: {
      sortBy: 'status' satisfies keyof ClaimEntity,
      direction: 'asc',
    },
    actions: {
      edit: {
        isAccessible: handleEditIsAccessible,
        after: handleEditAfter,
      },
    },
    properties: {
      userId: {
        reference: USER_RESOURCE_ID,
      },
      rewardId: {
        reference: REWARD_RESOURCE_ID,
      },
    },
  },
  features: [targetRelationSettingsFeature(), loggerFeatureSetup()],
});
