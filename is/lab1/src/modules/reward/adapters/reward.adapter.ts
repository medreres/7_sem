import { AttachmentAdapter } from '../../attachment/adapters/attachment.adapter.js';
import { RewardDto } from '../dto/reward.dto.js';
import { RewardWithStatusDto } from '../dto/reward-with-status.dto.js';
import { RewardEntity } from '../entities/reward.entity.js';
import { RewardStatus } from '../enums/reward-status.enum.js';

export class RewardAdapter {
  static toDto(entity: RewardEntity): RewardDto;
  static toDto(entity: RewardEntity, status: RewardStatus): RewardWithStatusDto;

  static toDto(
    entity: RewardEntity,
    status?: RewardStatus,
  ): RewardDto | RewardWithStatusDto {
    const attachment = entity.attachments?.at(0);

    const imageUrl = attachment
      ? AttachmentAdapter.toDto(attachment).fileUrl
      : undefined;

    const dto = {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      termOfUse: entity.termOfUse,
      cost: entity.cost,
      imageUrl,
    };

    if (status !== undefined) {
      return {
        ...dto,
        status,
      };
    }

    return dto;
  }
}
