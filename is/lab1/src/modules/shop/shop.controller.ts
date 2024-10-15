import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ShopAdapter } from './adapters/shop-adapter.js';
import { SearchShopsInput } from './dto/searchShops/input.js';
import { SearchShopsOutput } from './dto/searchShops/output.js';
import { ShopWithDistanceDto } from './dto/shop-with-distance.dto.js';
import { ShopService } from './shop.service.js';

import { UserGuard } from '../auth/guards/user.guard.js';
import { ErrorOutput } from '../common/dto/error.output.js';

@UseGuards(UserGuard)
@ApiTags('Shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('/search')
  @ApiOkResponse({
    description: 'Search shops by location',
    type: SearchShopsOutput,
  })
  @ApiBadRequestResponse({
    description: 'Invalid userLatitude',
    type: ErrorOutput,
  })
  async searchShops(
    @Query() query: SearchShopsInput,
  ): Promise<SearchShopsOutput> {
    const params = {
      mapCenterLocation: {
        latitude: query.mapCenterLatitude,
        longitude: query.mapCenterLongitude,
      },
      userLocation: {
        latitude: query.userLatitude,
        longitude: query.userLongitude,
      },
      radiusInKm: query.radiusInKm,
      limit: query.limit,
    };

    const results = await this.shopService.searchShops(params);

    return {
      shops: results.map(({ shop, distance }) => {
        const res: ShopWithDistanceDto = {
          ...ShopAdapter.toDto(shop),
        };

        if (distance) {
          res.distance = distance;
        }

        return res;
      }),
    };
  }
}
