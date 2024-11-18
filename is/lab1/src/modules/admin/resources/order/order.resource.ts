import {
  owningRelationSettingsFeature,
  RelationType,
  targetRelationSettingsFeature,
} from '@adminjs/relations';

import { ORDER_ITEM_RESOURCE_ID } from './order-item.resource.js';

import { adminConfig } from '../../../config/admin.js';
import { OrderEntity } from '../../../order/enttities/order.entity.js';
import { OrderItemEntity } from '../../../order/enttities/order-item.entity.js';
import { componentLoader } from '../../components/index.js';
import { Resource } from '../../types/resource.js';
import { loggerFeatureSetup } from '../log/feature.js';
import { USER_RESOURCE_ID } from '../user/user/user.resource.js';

export const ORDER_RESOURCE_ID = 'Order';

export const createOrderResource = (): Resource<OrderEntity> => ({
  resource: OrderEntity,
  options: {
    navigation: {
      name: 'Order',
      icon: 'ShoppingCart',
    },
    id: ORDER_RESOURCE_ID,
    properties: {
      // orderDate: { isVisible: { list: true, filter: true, show: true } },
      userId: {
        reference: USER_RESOURCE_ID,
      },
      orderItems: {
        reference: ORDER_ITEM_RESOURCE_ID,
      },
    },
  },
  features: [
    targetRelationSettingsFeature(),
    loggerFeatureSetup(),
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: adminConfig.privateKey,
      relations: {
        orderItems: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'orderId' as keyof OrderItemEntity,
            resourceId: ORDER_ITEM_RESOURCE_ID,
          },
        },
      },
    }),
  ],
});
