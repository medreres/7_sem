import { NotificationType } from '../../notification/enums/notification-type.enum.js';
import { SendNotificationsEvent } from '../../notification/events/send-notifications.event.js';

type Params = {
  userIds: number[];
};

export const createPointsExpiredNotification = (
  params: Params,
): SendNotificationsEvent['payload'] => {
  const { userIds } = params;

  return {
    userIds,
    content: {
      type: NotificationType.PointsBurned,
      title: 'Points Deducted 🔥',
      message:
        'Lifetime points have expired. Check your balance to see the updated amount.',
    },
  };
};
