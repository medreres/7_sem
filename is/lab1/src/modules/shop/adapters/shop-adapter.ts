import { ShopDto } from '../dto/shop.dto.js';
import { ShopEntity } from '../entities/shop.entity.js';

export class ShopAdapter {
  static toDto(entity: ShopEntity): ShopDto {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address,
      location: {
        longitude: entity.location.coordinates[0] || 0,
        latitude: entity.location.coordinates[1] || 0,
      },
    };
  }
}
