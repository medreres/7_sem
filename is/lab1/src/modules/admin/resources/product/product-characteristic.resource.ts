import { targetRelationSettingsFeature } from '@adminjs/relations';

import { PRODUCT_RESOURCE_ID } from './product/product.resource.js';

import { ProductCharacteristicEntity } from '../../../product/entities/product-characteristic.entity.js';
import { Resource } from '../../types/resource.js';

export const PRODUCT_CHARACTERISTIC_RESOURCE_ID = 'Product Characteristics';

export const createProductCharacteristicResource =
  (): Resource<ProductCharacteristicEntity> => ({
    resource: ProductCharacteristicEntity,
    options: {
      navigation: false,
      id: PRODUCT_CHARACTERISTIC_RESOURCE_ID,
      properties: {
        productId: {
          reference: PRODUCT_RESOURCE_ID,
        },
      },
    },
    features: [targetRelationSettingsFeature()],
  });
