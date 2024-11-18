// @ts-nocheck
import { targetRelationSettingsFeature } from '@adminjs/relations';

import { ORDER_RESOURCE_ID } from './order.resource.js';

import { OrderItemEntity } from '../../../order/enttities/order-item.entity.js';
import { pointsInputProps } from '../../components/points-input.props.js';
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
      quantity: {
        props: pointsInputProps,
      },
    },
    actions: {
      new: {
        handler: async (request, response, context) => {
          const { payload } = request;
          const { orderId, productId, quantity } = payload;

          if (!orderId || !productId || !quantity) {
            throw new Error('Order ID, Product ID, and Quantity are required.');
          }

          // Check if an OrderItem with the same order and product already exists
          const existingOrderItem = await OrderItemEntity.findOne({
            where: { orderId, productId },
          });

          if (existingOrderItem) {
            // Update the quantity of the existing OrderItem
            existingOrderItem.quantity += parseInt(quantity, 10);
            await existingOrderItem.save();

            return {
              notice: {
                message: 'Quantity updated for existing Order Item.',
                type: 'success',
              },
              record: existingOrderItem,
            };
          }

          // If no existing OrderItem, create a new one
          const newOrderItem = await OrderItemEntity.create({
            orderId,
            productId,
            quantity: parseInt(quantity, 10),
          }).save();

          return {
            notice: {
              message: 'New Order Item created successfully.',
              type: 'success',
            },
            record: newOrderItem,
          };
        },
      },
    },
  },
  features: [targetRelationSettingsFeature(), loggerFeatureSetup()],
});
