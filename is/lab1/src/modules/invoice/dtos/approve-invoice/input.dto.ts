import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsPositive } from 'class-validator';

export class ApproveInvoiceInput {
  @ApiProperty({ description: 'Amount of points to assign to user' })
  @IsPositive()
  pointsAmount: number;

  @ApiProperty({ description: 'Date when invoice was issued' })
  @IsDateString()
  issuedAt: Date;
}
