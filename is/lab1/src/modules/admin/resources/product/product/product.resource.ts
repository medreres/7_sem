import {
  owningRelationSettingsFeature,
  RelationType,
} from '@adminjs/relations';
import { ActionRequest, ValidationError } from 'adminjs';
import { Not } from 'typeorm';

import { AttachmentEntity } from '../../../../attachment/entities/attachment.entity.js';
import { adminConfig } from '../../../../config/admin.js';
import { ProductEntity } from '../../../../product/entities/product.entity.js';
import { ProductCharacteristicEntity } from '../../../../product/entities/product-characteristic.entity.js';
import { createProductSchema } from '../../../../product/schemas/create-product.schema.js';
import { updateProductSchema } from '../../../../product/schemas/update-product.schema.js';
import { componentLoader } from '../../../components/index.js';
import { Resource } from '../../../types/resource.js';
import { validateWithSchema } from '../../../utils/validateSchema.js';
import { ATTACHMENT_RESOURCE_ID } from '../../attachment.resource.js';
import { loggerFeatureSetup } from '../../log/feature.js';
import { CATEGORY_RESOURCE_ID } from '../category.resource.js';
import { navigation } from '../navigation.js';
import { PRODUCT_CHARACTERISTIC_RESOURCE_ID } from '../product-characteristic.resource.js';
import { SUB_CATEGORY_RESOURCE_ID } from '../sub-category.resource.js';
import { SUB_SUB_CATEGORY_RESOURCE_ID } from '../sub-sub-category.resource.js';

export const PRODUCT_RESOURCE_ID = 'Product list';

export const createProductResource = (): Resource<ProductEntity> => ({
  resource: ProductEntity,
  options: {
    navigation,
    id: PRODUCT_RESOURCE_ID,
    sort: { sortBy: 'createdAt', direction: 'desc' },
    properties: {
      id: { isVisible: { show: true } },
      dataSheetUrl: { props: { type: 'url' } },
      name: {
        isRequired: true,
      },
      code: { isRequired: true },
      productInternalId: { isRequired: true },
      categoryId: { isRequired: true, reference: CATEGORY_RESOURCE_ID },
      description: { isRequired: true },
      status: { isRequired: true },
      isHidden: { isRequired: true },
      subCategoryId: {
        reference: SUB_CATEGORY_RESOURCE_ID,
      },
      subSubCategoryId: {
        reference: SUB_SUB_CATEGORY_RESOURCE_ID,
      },
    },
    listProperties: [
      'name',
      'code',
      'productInternalId',
      'categoryId',
      'subCategoryId',
      'subSubCategoryId',
      'description',
      'status',
      'isHidden',
    ],
    actions: {
      new: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as ProductEntity;

          await validateWithSchema(createProductSchema, payload);

          const existingProduct = await ProductEntity.findOne({
            where: [
              { code: payload.code },
              { productInternalId: payload.productInternalId },
            ],
          });

          if (existingProduct) {
            const key =
              existingProduct.code === payload.code
                ? 'code'
                : 'productInternalId';

            throw new ValidationError({
              [key]: {
                message: `Product with such ${existingProduct.code === payload.code ? 'code' : 'internal ID'} already exists.`,
              },
            });
          }

          return request;
        },
      },
      edit: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as ProductEntity;
          const productId = Number(request.params.recordId);

          if (request.method === 'post') {
            await validateWithSchema(updateProductSchema, payload);

            const existingProduct = await ProductEntity.findOne({
              where: [
                { code: payload.code, id: Not(productId) },
                {
                  productInternalId: payload.productInternalId,
                  id: Not(productId),
                },
              ],
            });

            if (existingProduct) {
              const key =
                existingProduct.code === payload.code
                  ? 'code'
                  : 'productInternalId';

              throw new ValidationError({
                [key]: {
                  message: `Product with such ${existingProduct.code === payload.code ? 'code' : 'internal ID'} already exists.`,
                },
              });
            }
          }

          return request;
        },
      },
    },
  },
  features: [
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: adminConfig.privateKey,
      relations: {
        attachments: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'productId' as keyof AttachmentEntity,
            resourceId: ATTACHMENT_RESOURCE_ID,
          },
        },
        characteristics: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'productId' as keyof ProductCharacteristicEntity,
            resourceId: PRODUCT_CHARACTERISTIC_RESOURCE_ID,
          },
        },
      },
    }),
    loggerFeatureSetup(),
  ],
});
