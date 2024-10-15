import {
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dto/page-options.dto.js';
import { optionalBooleanMap } from '../../../common/utils/class-transformer.js';
import { ProductDto } from '../product.dto.js';

export class SearchProductsInput extends IntersectionType(
  PageOptionsDto,
  PickType(ProductDto, ['status']),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  subCategoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  subSubCategoryId?: number;

  @ApiPropertyOptional({
    description: 'Sort products by status (new products first)',
  })
  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    return typeof value === 'boolean'
      ? value
      : optionalBooleanMap.get(value as string);
  })
  shouldSortByNewFirst?: boolean;
}
