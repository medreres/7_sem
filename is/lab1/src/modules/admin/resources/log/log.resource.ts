import { createLoggerResource } from '@adminjs/logger';

import { handleShowAfter } from './handle-show-after.js';
import { navigation } from './navigation.js';

import { LogEntity } from '../../../logs/entities/log.entity.js';
import { componentLoader } from '../../components/index.js';
import { Resource } from '../../types/resource.js';

export const LOGS_RESOURCE_ID = 'Logs list';

export const createLogResource = (): Resource<LogEntity> =>
  createLoggerResource({
    resource: LogEntity,
    componentLoader,
    featureOptions: {
      userIdAttribute: 'id', // primary key currently logged user
      propertiesMapping: {
        user: 'userId',
      },
      resourceOptions: {
        navigation,
        resourceId: LOGS_RESOURCE_ID,
        actions: {
          show: {
            after: handleShowAfter,
          },
        },
      },
      componentLoader,
    },
  });
