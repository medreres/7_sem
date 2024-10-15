import { ApiProperty } from '@nestjs/swagger';

export class PointTransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;
}
