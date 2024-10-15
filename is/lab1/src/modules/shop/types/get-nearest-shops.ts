import { ShopEntity } from '../entities/shop.entity.js';

export type SearchShopsParams = {
  mapCenterLocation: {
    latitude: number;
    longitude: number;
  };
  userLocation: {
    latitude?: number;
    longitude?: number;
  };
  limit?: number;
  radiusInKm?: number;
};

export type SearchShopResult = {
  shop: ShopEntity;
  distance?: number;
};

export type SearchShopsReturnType = SearchShopResult[];
