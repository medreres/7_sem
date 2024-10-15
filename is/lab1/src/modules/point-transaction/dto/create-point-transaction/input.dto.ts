import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreatePointTransactionInput {
  @ApiProperty()
  @IsNumber()
  // TODO extract to transformToNumber decorator
  @Transform(({ value }) => Number(value))
  userId: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @ApiProperty()
  @IsString()
  description: string;
}
