import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fileUrl: string;
}
