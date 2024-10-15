import { ApiProperty } from '@nestjs/swagger';

export class GenerateUploadUrlForInvoiceOutput {
  @ApiProperty({ description: 'Link to upload file to' })
  uploadLink: string;
}
