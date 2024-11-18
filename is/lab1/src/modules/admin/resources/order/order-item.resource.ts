import { targetRelationSettingsFeature } from '@adminjs/relations';

import { ORDER_RESOURCE_ID } from './order.resource.js';

import { OrderItemEntity } from '../../../order/enttities/order-item.entity.js';
import { Resource } from '../../types/resource.js';
import { loggerFeatureSetup } from '../log/feature.js';
import { PRODUCT_RESOURCE_ID } from '../product/product/product.resource.js';

export const ORDER_ITEM_RESOURCE_ID = 'Order Item';

export const createOrderItemResource = (): Resource<OrderItemEntity> => ({
  resource: OrderItemEntity,
  options: {
    navigation: {
      name: 'Order',
      icon: 'ShoppingCart',
    },
    id: ORDER_ITEM_RESOURCE_ID,
    properties: {
      productId: {
        reference: PRODUCT_RESOURCE_ID,
      },
      orderId: {
        reference: ORDER_RESOURCE_ID,
      },
    },
  },
  features: [targetRelationSettingsFeature(), loggerFeatureSetup()],
});
