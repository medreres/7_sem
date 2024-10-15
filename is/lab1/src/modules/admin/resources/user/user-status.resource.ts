import { navigation } from './navigation.js';

import { UserStatusEntity } from '../../../user/entities/user-status.entity.js';
import { Resource } from '../../types/resource.js';
import { ResourceProperties } from '../../types/resource-properties.js';
import { loggerFeatureSetup } from '../log/feature.js';

export const USER_STATUS_RESOURCE_ID = 'User statuses';

export const createUserStatusResource = (): Resource<UserStatusEntity> => ({
  resource: UserStatusEntity,
  options: {
    navigation,
    id: USER_STATUS_RESOURCE_ID,
    actions: { new: { isAccessible: false }, delete: { isAccessible: false } },
    properties: {
      cost: {
        isRequired: true,
        description:
          'Amount of points user need to have to achieve this status',
      },
      description: {
        isRequired: true,
        description: 'Description of user status',
      },
      name: {
        isRequired: true,
        description: 'Status name ex. Bronze, Silver',
      },
    } satisfies ResourceProperties<UserStatusEntity>,
  },
  features: [loggerFeatureSetup()],
});
