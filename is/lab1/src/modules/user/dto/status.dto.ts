import { ApiProperty } from '@nestjs/swagger';

import { UserStatusDto } from './user-status.dto.js';

import { Status } from '../types/status.js';

export class StatusDto implements Status {
  @ApiProperty({
    description: 'Current status data',
  })
  currentStatus: UserStatusDto;

  @ApiProperty({
    description:
      'Next status data. Can be nullable meaning that user reached max status.',
    nullable: true,
  })
  nextStatus?: UserStatusDto;

  @ApiProperty({
    description: 'Current amount of points user has.',
  })
  pointsAmount: number;
}
