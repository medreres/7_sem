import { ApiPropertyOptional } from '@nestjs/swagger';

import { ShopDto } from './shop.dto.js';

export class ShopWithDistanceDto extends ShopDto {
  @ApiPropertyOptional({
    description: 'Distance from shop to user location in kilometers',
  })
  distance?: number;
}
