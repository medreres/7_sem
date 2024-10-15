import { ApiProperty } from '@nestjs/swagger';

import { PaginatedDto } from '../../../common/dto/paginated-dto.js';
import { RewardWithStatusDto } from '../reward-with-status.dto.js';

export class GetRewardsOutput extends PaginatedDto {
  @ApiProperty({ type: () => [RewardWithStatusDto] })
  data: RewardWithStatusDto[];
}
