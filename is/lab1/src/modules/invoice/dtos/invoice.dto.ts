import { ApiProperty } from '@nestjs/swagger';

import { InvoiceStatus } from '../enums/invoice-status.enum.js';

export class InvoiceDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty({ description: 'Reason why invoice was rejected' })
  rejectionReason?: string;

  @ApiProperty({ description: 'Url to uploaded invoice' })
  invoiceUrl?: string;
}
