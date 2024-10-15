import { ActionContext, ActionRequest } from 'adminjs';

import { ExtendedReward } from './types.js';

import { AttachmentService } from '../../../attachment/attachment.service.js';
import { AttachmentEntity } from '../../../attachment/entities/attachment.entity.js';
import { serializeError } from '../../../common/utils/serialize-error.js';
import { logger } from '../../logger.js';

export const handleEditAfter = async (
  ctx,
  request: ActionRequest,
): Promise<ActionContext> => {
  const context = ctx as ActionContext;
  const reward = context.record?.params as ExtendedReward | undefined;

  if (!reward) {
    logger.error('Error when trying to update attachment for reward');
    logger.debug(serializeError(context));

    return context;
  }

  const attachmentService = new AttachmentService(
    AttachmentEntity.getRepository(),
  );

  // * attach fileUrl to virtual column
  if (request.method === 'get') {
    const attachment = await attachmentService.getAttachmentByResourceId({
      rewardId: reward?.id,
    });

    if (attachment) {
      reward.imageUrl = attachment.fileUrl;
    }

    return context;
  }

  if (reward.imageUrl) {
    await attachmentService.createOrUpdateExistingAttachment(
      {
        rewardId: reward.id,
      },
      reward.imageUrl,
    );
  }

  return context;
};
