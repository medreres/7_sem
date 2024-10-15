import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, ValidateIf } from 'class-validator';

import { GetCategoriesInput } from '../get-categories/input.js';

export class GetCategoryInput extends GetCategoriesInput {
  @ValidateIf(
    (input: GetCategoryInput) => !input.categoryId && !input.subCategoryId,
  )
  @ApiPropertyOptional({
    nullable: true,
    description: 'Category id',
  })
  @IsOptional()
  @IsNumberString()
  subSubCategoryId?: number;
}
