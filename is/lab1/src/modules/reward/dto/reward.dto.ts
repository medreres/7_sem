import { ApiProperty } from '@nestjs/swagger';

export class RewardDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  termOfUse?: string;

  @ApiProperty()
  cost: number;

  @ApiProperty({ description: 'Reward image url' })
  imageUrl?: string;
}
