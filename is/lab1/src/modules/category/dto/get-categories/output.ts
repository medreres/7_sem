import { ApiProperty } from '@nestjs/swagger';

import { CategoryDto } from '../category.dto.js';

export class GetCategoriesOutput {
  @ApiProperty()
  totalProductsCount: number;

  @ApiProperty({ type: () => [CategoryDto] })
  categories: CategoryDto[];
}
