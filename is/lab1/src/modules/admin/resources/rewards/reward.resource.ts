import { handleEditAfter } from './handle-edit-after.js';
import { handleNewAfter } from './handle-new-after.js';
import { handleShowAfter } from './handle-snhow-after.js';
import { navigation } from './navigation.js';
import { ExtendedReward } from './types.js';

import { RewardEntity } from '../../../reward/entities/reward.entity.js';
import { components } from '../../components/index.js';
import { pointsInputProps } from '../../components/points-input.props.js';
import { Resource } from '../../types/resource.js';
import { loggerFeatureSetup } from '../log/feature.js';

export const REWARD_RESOURCE_ID = 'Rewards';

export const createRewardResource = (): Resource<ExtendedReward> => ({
  resource: RewardEntity,
  options: {
    navigation,
    id: REWARD_RESOURCE_ID,
    actions: {
      new: {
        after: handleNewAfter,
      },
      show: {
        after: handleShowAfter,
      },
      edit: {
        after: handleEditAfter,
      },
    },
    properties: {
      name: { isRequired: true },
      cost: {
        isRequired: true,
        props: pointsInputProps,
      },
      description: { isRequired: true },
      termOfUse: { isRequired: false },
      imageUrl: {
        props: { type: 'url' },
        isRequired: false,
        components: {
          show: components.ImagePreview,
        },
      },
      isHidden: { isRequired: true },
    },
  },
  features: [loggerFeatureSetup()],
});
