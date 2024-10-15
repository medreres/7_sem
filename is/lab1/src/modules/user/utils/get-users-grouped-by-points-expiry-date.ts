import { addMilliseconds, isWithinInterval, subMilliseconds } from 'date-fns';

import { UserEntity } from '../entities/user.entity.js';

type Params = {
  beforeExpiryNotificationRangesInMs: number[];
  expirationDurationInMs: number;
  notificationTimeDeltaInMs: number;
  users: UserEntity[];
};

export const getUserIdsGroupedByExpiryDateInMs = (
  params: Params,
): Record<string, number[]> => {
  const {
    beforeExpiryNotificationRangesInMs,
    expirationDurationInMs,
    users,
    notificationTimeDeltaInMs,
  } = params;

  const daysBeforeExpiryToUserId: Record<string, number[]> = {};
  // * if now() is within notification range -+ delta then add to the group
  // * app starts countdown from expiry date, but we need countdown to expiry
  const currentDate = new Date();

  users.forEach((user) => {
    const expiryDate = addMilliseconds(
      new Date(user.lastResetPointsAt),
      expirationDurationInMs,
    );

    const closestNotificationDateBeforeExpiry =
      beforeExpiryNotificationRangesInMs.find((msBeforeExpiration) => {
        const notificationDate = subMilliseconds(
          expiryDate,
          msBeforeExpiration,
        );

        const lowestBoundary = subMilliseconds(
          notificationDate,
          notificationTimeDeltaInMs,
        );

        const highestBoundary = addMilliseconds(
          notificationDate,
          notificationTimeDeltaInMs,
        );

        const isDateWithingRange = isWithinInterval(currentDate, {
          start: lowestBoundary,
          end: highestBoundary,
        });

        return isDateWithingRange;
      });

    if (closestNotificationDateBeforeExpiry) {
      const existingIds =
        daysBeforeExpiryToUserId[closestNotificationDateBeforeExpiry] ?? [];

      existingIds.push(user.id);

      daysBeforeExpiryToUserId[closestNotificationDateBeforeExpiry.toString()] =
        existingIds;
    }
  });

  return daysBeforeExpiryToUserId;
};
