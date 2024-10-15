import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateUploadUrlForInvoiceInput {
  @ApiProperty({ description: 'Name of file being uploaded' })
  @IsString()
  fileName: string;
}
