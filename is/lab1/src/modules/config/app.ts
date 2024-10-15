import { envConfig, NodeEnv } from './schema.js';

export const appConfig = {
  accessTokenSecret: envConfig.ACCESS_TOKEN_SECRET,
  port: envConfig.PORT,
  nodeEnv: envConfig.NODE_ENV,
  isProduction: envConfig.NODE_ENV === NodeEnv.Production,
  isTesting: envConfig.NODE_ENV === NodeEnv.Test,
  databaseUrl: envConfig.DATABASE_URL,
  sentryDsn: envConfig.SENTRY_DSN,
  supportEmail: envConfig.SUPPORT_EMAIL,
};
