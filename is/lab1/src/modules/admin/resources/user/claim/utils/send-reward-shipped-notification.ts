import { EventEmitter2 } from '@nestjs/event-emitter';

import { CryptoService } from '../../../../../crypto/crypto.service.js';
import { MailingService } from '../../../../../mailing/mailing.service.js';
import { NotificationEntity } from '../../../../../notification/entities/notification.entity.js';
import { NotificationService } from '../../../../../notification/notification.service.js';
import { PointTransactionEntity } from '../../../../../point-transaction/entities/point-transaction.entity.js';
import { PushNotificationService } from '../../../../../push-notification/push-notification.service.js';
import { RewardEntity } from '../../../../../reward/entities/reward.entity.js';
import { createShippedRewardEmailContent } from '../../../../../reward/utils/create-shipped-reward-email-content.js';
import { createShippedRewardNotificationContent } from '../../../../../reward/utils/create-shipped-reward-notification-content.js';
import { UserEntity } from '../../../../../user/entities/user.entity.js';
import { UserStatusEntity } from '../../../../../user/entities/user-status.entity.js';
import { UserService } from '../../../../../user/user.service.js';

type Params = {
  rewardId: number;
  userId: number;
};

export const sendRewardShippedNotification = async (
  params: Params,
): Promise<void> => {
  const { rewardId, userId } = params;

  const user = await UserEntity.getRepository().findOneOrFail({
    where: { id: userId },
  });

  const reward = await RewardEntity.getRepository().findOneOrFail({
    where: { id: rewardId },
  });

  const { subject, body } = createShippedRewardEmailContent(user, reward);

  const mailingService = new MailingService();

  const notificationService = new NotificationService(
    NotificationEntity.getRepository(),
    new PushNotificationService(),
    new UserService(
      UserEntity.getRepository(),
      UserStatusEntity.getRepository(),
      PointTransactionEntity.getRepository(),
      new CryptoService(),
      new EventEmitter2(),
    ),
  );

  await mailingService.sendHtmlEmail({
    recipients: [user.email],
    subject,
    body,
  });

  const notificationContent = createShippedRewardNotificationContent(
    reward,
    user,
  );

  await notificationService.createAndSendNotification({
    content: notificationContent,
    userId: user.id,
  });
};
