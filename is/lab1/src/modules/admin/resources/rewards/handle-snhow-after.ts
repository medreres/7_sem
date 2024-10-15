import { ActionContext } from 'adminjs';

import { AttachmentService } from '../../../attachment/attachment.service.js';
import { AttachmentEntity } from '../../../attachment/entities/attachment.entity.js';
import { serializeError } from '../../../common/utils/serialize-error.js';
import { RewardEntity } from '../../../reward/entities/reward.entity.js';
import { logger } from '../../logger.js';

export const handleShowAfter = async (ctx): Promise<ActionContext> => {
  const context = ctx as ActionContext;

  const reward = context.record?.params as RewardEntity | undefined;

  if (!reward) {
    logger.error('Error when trying to update attachment for reward');
    logger.debug(serializeError(context));

    return context;
  }

  const attachmentService = new AttachmentService(
    AttachmentEntity.getRepository(),
  );

  // * attachment are not included when fetching reward, so we need to fetch them manually
  const attachment = await attachmentService.getAttachmentByResourceId({
    rewardId: reward.id,
  });

  if (attachment) {
    reward.attachments = [attachment];
  }

  return context;
};
