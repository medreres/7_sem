import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProductCharacteristicDto } from './product-characteristic.dto.js';

import { CategoryDto } from '../../category/dto/category.dto.js';
import { AttachmentDto } from '../../common/dto/attachment.dto.js';
import { ProductStatus } from '../enum/product-status.enum.js';

export class ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  productInternalId: string;

  @ApiProperty()
  categoryId: number;

  @ApiPropertyOptional({ nullable: true })
  subCategoryId?: number;

  @ApiPropertyOptional({ nullable: true })
  subSubCategoryId?: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ nullable: true })
  dataSheetUrl?: string;

  @ApiProperty({ nullable: true })
  quickStartUrl?: string;

  @ApiProperty({ nullable: true })
  instructionsUrl?: string;

  @ApiProperty()
  isHidden: boolean;

  @ApiPropertyOptional({ enum: ProductStatus })
  status?: ProductStatus;

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ type: CategoryDto, nullable: true })
  subCategory?: CategoryDto;

  @ApiProperty({ type: CategoryDto, nullable: true })
  subSubCategory?: CategoryDto;

  @ApiProperty({ type: [ProductCharacteristicDto] })
  characteristics: ProductCharacteristicDto[];

  @ApiProperty({ type: [AttachmentDto] })
  attachments: AttachmentDto[];
}
