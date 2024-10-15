import { ApiProperty } from '@nestjs/swagger';

import { ShopWithDistanceDto } from '../shop-with-distance.dto.js';

export class SearchShopsOutput {
  @ApiProperty({
    description: 'List of shops',
    type: () => [ShopWithDistanceDto],
  })
  shops: ShopWithDistanceDto[];
}
