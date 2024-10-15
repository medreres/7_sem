import loggerFeature from '@adminjs/logger';
import { FeatureType } from 'adminjs';

import { LOGS_RESOURCE_ID } from './log.resource.js';

import { componentLoader } from '../../components/index.js';

export const loggerFeatureSetup = (): FeatureType => {
  return loggerFeature({
    componentLoader,
    propertiesMapping: {
      user: 'userId',
    },
    userIdAttribute: 'id',
    resourceOptions: {
      resourceId: LOGS_RESOURCE_ID,
    },
  });
};
