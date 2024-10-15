import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShopEntity } from './entities/shop.entity.js';
import {
  SearchShopResult,
  SearchShopsParams,
  SearchShopsReturnType,
} from './types/get-nearest-shops.js';

import { DEFAULT_SHOPS_LIMIT } from '../common/constants.js';
import {
  convertKilometersToMeters,
  convertMetersToKilometers,
} from '../common/utils/converter.js';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>,
  ) {}

  async searchShops(params: SearchShopsParams): Promise<SearchShopsReturnType> {
    const {
      mapCenterLocation,
      userLocation,
      radiusInKm,
      limit = DEFAULT_SHOPS_LIMIT,
    } = params;

    if (
      (userLocation.latitude && !userLocation.longitude) ||
      (userLocation.longitude && !userLocation.latitude)
    ) {
      throw new BadRequestException(
        'You should set userLatitude together with userLongitude',
      );
    }

    const queryBuilder = this.shopRepository.createQueryBuilder('shop');

    if (userLocation.latitude && userLocation.longitude) {
      queryBuilder
        .addSelect(
          // eslint-disable-next-line @cspell/spellchecker -- extension func name
          'ST_Distance(shop.location, ST_SetSRID(ST_MakePoint(:userLongitude, :userLatitude), 4326))',
          'distance',
        )
        .setParameters({
          userLatitude: userLocation.latitude,
          userLongitude: userLocation.longitude,
        });
    } else {
      queryBuilder
        .addSelect(
          // eslint-disable-next-line @cspell/spellchecker -- extension func name
          'ST_Distance(shop.location, ST_SetSRID(ST_MakePoint(:mapCenterLongitude, :mapCenterLatitude), 4326))',
          'distance',
        )
        .setParameters({
          mapCenterLatitude: mapCenterLocation.latitude,
          mapCenterLongitude: mapCenterLocation.longitude,
        });
    }

    if (radiusInKm) {
      queryBuilder.where(
        // eslint-disable-next-line @cspell/spellchecker -- extension func name
        'ST_DWithin(shop.location, ST_SetSRID(ST_MakePoint(:mapCenterLongitude, :mapCenterLatitude), 4326), :radius)',
        {
          mapCenterLatitude: mapCenterLocation.latitude,
          mapCenterLongitude: mapCenterLocation.longitude,
          radius: convertKilometersToMeters(radiusInKm),
        },
      );
    }

    const { raw, entities } = await queryBuilder
      .orderBy('distance', 'ASC')
      .limit(limit)
      .getRawAndEntities();

    const preparedResults = entities.map((shop, idx) => {
      const result: SearchShopResult = {
        shop,
      };

      // set distance only if userLocation params exist
      if (userLocation.latitude && userLocation.longitude) {
        result.distance = convertMetersToKilometers(
          parseFloat(raw[idx].distance as string),
        );
      }

      return result;
    });

    return preparedResults;
  }
}
