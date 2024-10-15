import { ApiProperty } from '@nestjs/swagger';

import { RewardDto } from './reward.dto.js';

import { ClaimStatus } from '../enums/claim-status.enum.js';

export class ClaimDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ClaimStatus })
  status: ClaimStatus;

  @ApiProperty({ description: 'Date when reward was shipped.' })
  updatedAt: Date;

  @ApiProperty({ description: 'Date when reward was claimed.' })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  reward?: RewardDto;
}
