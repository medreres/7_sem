import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateInvoiceInput {
  @ApiProperty({
    description:
      'Url for uploaded file. Can be either image name (image.png) if it was previously uploaded via signed url or direct link to resource (https://exemaple.com)',
    examples: ['image.png', 'https://example.com/'],
  })
  @IsString()
  fileName: string;
}
