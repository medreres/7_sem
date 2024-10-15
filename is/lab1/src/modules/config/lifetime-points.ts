/* eslint-disable no-magic-numbers -- config */
import { CronExpression } from '@nestjs/schedule';

import { ONE_MINUTE_IN_MS } from './constants.js';
import { envConfig } from './schema.js';

export const lifetimePointsConfig = {
  lifetimeInMs: envConfig.LIFETIME_POINTS_LIFETIME_IN_MS,
  // * because every cron job is every ten minutes, we don't need them to overlap data
  notificationTimeDeltaInMs: ONE_MINUTE_IN_MS / 2,
  lifetimePointsCronTime: CronExpression.EVERY_MINUTE,
  beforeExpiryNotificationRangesInMs:
    envConfig.LIFETIME_POINTS_BEFORE_EXPIRY_NOTIFICATION_TIME_RANGES.sort(
      (a, b) => a - b,
    ),
};
