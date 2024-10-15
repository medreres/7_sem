import { ApiProperty } from '@nestjs/swagger';

export class UserStatusDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    description: 'Amount of points to earn new status.',
  })
  cost: number;
}
