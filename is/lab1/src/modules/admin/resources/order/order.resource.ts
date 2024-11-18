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
      userId: {
        reference: USER_RESOURCE_ID,
      },
      orderItems: {
        reference: ORDER_ITEM_RESOURCE_ID,
      },
      total: {
        type: 'currency',
      },
    },
    actions: {
      show: {
        after: async (response, request, context) => {
          const order = context.record.params;

          // Fetch order items with product prices
          const orderItems = await OrderItemEntity.find({
            where: { orderId: order.id },
            relations: ['product'],
          });

          // Calculate total
          const total = orderItems.reduce(
            // @ts-expect-error
            (sum, item) => sum + item.quantity * item.product.price,
            0,
          );

          // Attach total to the record
          response.record.params.total = total / 100; // Convert cents to currency

          return response;
        },
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
