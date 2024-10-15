import { ApiProperty } from '@nestjs/swagger';

import { RewardDto } from './reward.dto.js';

import { RewardStatus } from '../enums/reward-status.enum.js';

export class RewardWithStatusDto extends RewardDto {
  @ApiProperty({ description: 'Reward status', enum: RewardStatus })
  status: RewardStatus;
}
