import { ActionContext } from 'adminjs';

import { ExtendedReward } from './types.js';

import { AttachmentService } from '../../../attachment/attachment.service.js';
import { AttachmentEntity } from '../../../attachment/entities/attachment.entity.js';

export const handleNewAfter = async (ctx): Promise<ActionContext> => {
  const context = ctx as ActionContext;

  const attachmentService = new AttachmentService(
    AttachmentEntity.getRepository(),
  );

  const reward = context.record?.params as ExtendedReward;

  const { imageUrl } = reward;

  if (imageUrl) {
    await attachmentService.createAttachment({
      rewardId: reward.id,
      fileUrl: imageUrl,
    });
  }

  return context;
};
