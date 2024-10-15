import { ResourceWithOptions } from 'adminjs';

import { ProductCharacteristicEntity } from '../../product/entities/product-characteristic.entity.js';

export const createProductCharacteristicResource = (): ResourceWithOptions => ({
  resource: ProductCharacteristicEntity,
  options: {
    navigation: {
      name: 'Product management',
      icon: 'Folder',
    },
    actions: {},
  },
});
