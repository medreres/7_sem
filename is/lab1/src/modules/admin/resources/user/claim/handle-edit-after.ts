import { ActionContext } from 'adminjs';

import { sendRewardShippedNotification } from './utils/send-reward-shipped-notification.js';

import { ClaimEntity } from '../../../../reward/entities/claim.entity.js';
import { ClaimStatus } from '../../../../reward/enums/claim-status.enum.js';

export const handleEditAfter = async (ctx): Promise<ActionContext> => {
  const context = ctx as ActionContext;
  const claim = context.record?.params as ClaimEntity;

  if (claim.status === ClaimStatus.Shipped) {
    await sendRewardShippedNotification(claim);
  }

  return context;
};
