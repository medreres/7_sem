import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectInvoiceInput {
  @ApiProperty({ description: 'Rejection reason' })
  @IsString()
  reason: string;
}
