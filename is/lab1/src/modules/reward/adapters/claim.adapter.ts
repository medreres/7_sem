import { RewardAdapter } from './reward.adapter.js';

import { ClaimDto } from '../dto/claim.dto.js';
import { ClaimEntity } from '../entities/claim.entity.js';

export class ClaimAdapter {
  static toDto(entity: ClaimEntity): ClaimDto {
    return {
      id: entity.id,
      status: entity.status,
      updatedAt: entity.updatedAt,
      reward: entity.reward ? RewardAdapter.toDto(entity.reward) : undefined,
      createdAt: entity.createdAt,
    };
  }
}
