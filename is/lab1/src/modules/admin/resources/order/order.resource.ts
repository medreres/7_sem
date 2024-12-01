// @ts-nocheck
import {
  owningRelationSettingsFeature,
  RelationType,
  targetRelationSettingsFeature,
} from '@adminjs/relations';

import { ORDER_ITEM_RESOURCE_ID } from './order-item.resource.js';

import { adminConfig } from '../../../config/admin.js';
import { OrderEntity } from '../../../order/enttities/order.entity.js';
import { OrderItemEntity } from '../../../order/enttities/order-item.entity.js';
import { OrderPdfService } from '../../components/generate-pdf.js';
import { componentLoader, components } from '../../components/index.js';
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

      PDFGenerator: {
        actionType: 'record',
        icon: 'GeneratePdf',
        component: components.PDFGenerator,
        handler: async (request, res, context) => {
          const { record, currentAdmin } = context;

          const id = record?.params.id as string;

          const order = await OrderEntity.findOneOrFail({
            where: { id },
            relations: {
              orderItems: {
                product: true,
              },
            },
          });

          const pdfBuffer = OrderPdfService.generateOrderPdf(order);

          // // Set headers to tell the browser to open the PDF inline
          // res.setHeader('Content-Type', 'application/pdf');
          // res.setHeader(
          //   'Content-Disposition',
          //   'inline; filename="example.pdf"',
          // );

          // Send the PDF buffer to the frontend
          // return res.send(pdfBuffer);

          return {
            record: record.toJSON(currentAdmin),
            file: pdfBuffer.toString('base64'),
          };
        },
      },

      // PDFGenerator: {
      //   actionType: 'record',
      //   icon: 'Document',
      //   component: components.PDFGenerator,
      //   handler: async (request, response, context) => {
      //     const { record } = context;

      //     const id = record?.params.id as string;

      //     const order = await OrderEntity.findOneOrFail({
      //       where: { id },
      //       relations: {
      //         orderItems: {
      //           product: true,
      //         },
      //       },
      //     });

      //     console.log('order', order);

      //     const url = OrderPdfService.generateOrderPdf(order);

      //     console.log('url', url);

      //     return {
      //       record: JSON.stringify(order),
      //       url,
      //     };
      //   },
      // },

      // downloadPdf: {
      //   actionType: 'resource',
      //   icon: 'Download',
      //   handler: async (request, response, context) => {
      //     const { id } = request.params;

      //     // Fetch the order and related items
      //     const order = await OrderEntity.findOneOrFail({
      //       where: { id },
      //       relations: {
      //         orderItems: {
      //           product: true,
      //         },
      //       },
      //     });

      //     if (!order) {
      //       throw new Error('Order not found');
      //     }

      //     // Generate PDF
      //     const pdfBuffer = OrderPdfService.generateOrderPdf(order);

      //     // Set response headers and send PDF
      //     response.setHeader('Content-Type', 'application/pdf');
      //     response.setHeader(
      //       'Content-Disposition',
      //       `attachment; filename="order_${id}.pdf"`,
      //     );

      //     return response.send(pdfBuffer);
      //   },
      // },
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
