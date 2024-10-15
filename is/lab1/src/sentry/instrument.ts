import * as Sentry from '@sentry/nestjs';

import { appConfig } from '../modules/config/app.js';
import { NodeEnv } from '../modules/config/schema.js';

const isEnabled = [
  NodeEnv.Production,
  NodeEnv.Staging,
  NodeEnv.Development,
].includes(appConfig.nodeEnv!);

Sentry.init({
  dsn: appConfig.sentryDsn,

  integrations: [],

  // disable traces for now
  tracesSampleRate: 0,

  environment: appConfig.nodeEnv,

  enabled: isEnabled,
});
