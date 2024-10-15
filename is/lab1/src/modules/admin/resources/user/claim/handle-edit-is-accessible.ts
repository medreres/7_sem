import { ActionContext } from 'adminjs';

import { ClaimEntity } from '../../../../reward/entities/claim.entity.js';
import { ClaimStatus } from '../../../../reward/enums/claim-status.enum.js';

export const handleEditIsAccessible = (context: ActionContext): boolean => {
  const claim = context.record?.params as ClaimEntity | undefined;

  if (claim?.status !== ClaimStatus.Claimed) {
    return false;
  }

  return true;
};
