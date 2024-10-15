import { ApiProperty } from '@nestjs/swagger';

import { PaginatedDto } from '../../../common/dto/paginated-dto.js';
import { ProductDto } from '../product.dto.js';

export class SearchProductsOutput extends PaginatedDto {
  @ApiProperty({ type: () => [ProductDto] })
  data: ProductDto[];
}
