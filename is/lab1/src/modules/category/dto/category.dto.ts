import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AttachmentDto } from '../../common/dto/attachment.dto.js';

export class CategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  // attachments
  @ApiPropertyOptional({
    type: () => [AttachmentDto],
    required: false,
    description:
      'This field may not present in subCategories and subSubCategories.',
  })
  attachments?: AttachmentDto[];

  @ApiPropertyOptional({ description: 'Colors representing the category' })
  colors?: string[];

  @ApiPropertyOptional({ description: 'Color of text matching colors palette' })
  textColor?: string;
}
