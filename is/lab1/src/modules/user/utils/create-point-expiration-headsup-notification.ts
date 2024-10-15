import { addMilliseconds, formatDistanceStrict } from 'date-fns';

import { NotificationType } from '../../notification/enums/notification-type.enum.js';
import { SendNotificationsEvent } from '../../notification/events/send-notifications.event.js';

type Params = {
  timeRemainingInMs: number;

  userIds: number[];
};

export const createPointExpirationHeadsNotification = (
  params: Params,
): SendNotificationsEvent['payload'] => {
  const { userIds, timeRemainingInMs } = params;

  const now = new Date();

  const formattedTime = formatDistanceStrict(
    addMilliseconds(now, timeRemainingInMs),
    now,
    {
      addSuffix: true,
    },
  );

  return {
    userIds,
    content: {
      type: NotificationType.PointsExpirationHeads,
      title: 'Your Points Are Expiring Soon ⏳',
      message: `Notice: Your lifetime points will expire ${formattedTime}. Make sure to use them before they are gone!`,
    },
  };
};
