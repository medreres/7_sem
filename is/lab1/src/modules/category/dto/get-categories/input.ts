import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, ValidateIf } from 'class-validator';

export class GetCategoriesInput {
  @ValidateIf((user: GetCategoriesInput) => !user.subCategoryId)
  @ApiPropertyOptional({
    nullable: true,
    description: 'Category id',
  })
  @IsOptional()
  @IsNumberString()
  categoryId?: number;

  @ValidateIf((user: GetCategoriesInput) => !user.categoryId)
  @ApiPropertyOptional({
    nullable: true,
    description: 'Sub category id',
  })
  @IsOptional()
  @IsNumberString()
  subCategoryId?: number;
}
