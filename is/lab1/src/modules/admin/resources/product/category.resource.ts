import {
  owningRelationSettingsFeature,
  RelationType,
} from '@adminjs/relations';
import { ActionRequest, ValidationError } from 'adminjs';
import { Not } from 'typeorm';

import { navigation } from './navigation.js';

import { AttachmentEntity } from '../../../attachment/entities/attachment.entity.js';
import { CategoryEntity } from '../../../category/entities/category.entity.js';
import { createCategorySchema } from '../../../category/schemas/create-category.schema.js';
import { updateCategorySchema } from '../../../category/schemas/update-category.schema.js';
import { adminConfig } from '../../../config/admin.js';
import { componentLoader } from '../../components/index.js';
import { Resource } from '../../types/resource.js';
import { validateWithSchema } from '../../utils/validateSchema.js';
import { ATTACHMENT_RESOURCE_ID } from '../attachment.resource.js';
import { loggerFeatureSetup } from '../log/feature.js';

export const CATEGORY_RESOURCE_ID = 'Categories';

export const createCategoryResource = (): Resource<CategoryEntity> => ({
  resource: CategoryEntity,
  options: {
    navigation,
    id: CATEGORY_RESOURCE_ID,
    properties: {
      id: { isVisible: false },
      createdAt: { isVisible: { show: true } },
      updatedAt: { isVisible: { show: true } },
      internalCategoryId: { isRequired: true, type: 'number' },
      name: { isRequired: true },
      description: { isRequired: true },
      isHidden: { isRequired: true, type: 'boolean' },
      colors: { type: 'string' },
      textColor: { type: 'string' },
    },
    listProperties: ['internalCategoryId', 'name', 'isHidden'],
    actions: {
      new: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as CategoryEntity;

          await validateWithSchema(createCategorySchema, request.payload);

          const existingCategory = await CategoryEntity.findOne({
            where: [
              { internalCategoryId: payload.internalCategoryId },
              { name: payload.name },
            ],
          });

          if (existingCategory) {
            const key =
              existingCategory.name === payload.name
                ? 'name'
                : 'internalCategoryId';

            throw new ValidationError({
              [key]: {
                message: `Category with such ${existingCategory.name === payload.name ? 'name' : 'internal category ID'} already exists.`,
              },
            });
          }

          return request;
        },
      },
      edit: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as CategoryEntity;

          const categoryId = Number(request.params.recordId);

          if (request.method === 'post') {
            await validateWithSchema(updateCategorySchema, payload);

            // check if category with internalCategoryId, name already exists
            const existingCategory = await CategoryEntity.findOne({
              where: [
                {
                  internalCategoryId: payload.internalCategoryId,
                  id: Not(categoryId),
                },
                { name: payload.name, id: Not(categoryId) },
              ],
            });

            if (existingCategory) {
              const key =
                existingCategory.name === payload.name
                  ? 'name'
                  : 'internalCategoryId';

              throw new ValidationError({
                [key]: {
                  message: `Category with such ${existingCategory.name === payload.name ? 'name' : 'internal category ID'} already exists.`,
                },
              });
            }

            const category = await CategoryEntity.findOneOrFail({
              where: { id: categoryId },
              relations: [
                'subCategories',
                'subCategories.subSubCategories',
                'products',
              ],
            });

            // if admin want to hide category
            if (!category.isHidden && payload.isHidden === true) {
              const isUpdateAllowedFromSub = category.subCategories.every(
                (subCategory) => {
                  if (!subCategory.isHidden) {
                    return false;
                  }

                  return subCategory.subSubCategories.every(
                    (subSubCategory) => subSubCategory.isHidden,
                  );
                },
              );

              const isUpdateAllowedFromProducts = category.products.every(
                (product) => {
                  if (!product.isHidden) {
                    return false;
                  }

                  return true;
                },
              );

              if (!isUpdateAllowedFromSub || !isUpdateAllowedFromProducts) {
                throw new ValidationError(
                  {},
                  {
                    message:
                      'Category couldn`t be hidden without a hide of all child entities.',
                  },
                );
              }
            }
          }

          return request;
        },
      },
      delete: {
        before: async (request: ActionRequest) => {
          const categoryId = Number(request.params.recordId);

          const category = await CategoryEntity.findOneOrFail({
            where: { id: categoryId },
            relations: ['subCategories', 'products'],
          });

          if (category.subCategories.length > 0) {
            throw new ValidationError(
              {},
              {
                message:
                  'Category couldn`t be deleted without a deletion of all child sub-categories.',
              },
            );
          }

          if (category.products.length > 0) {
            throw new ValidationError(
              {},
              {
                message:
                  'Category couldn`t be deleted without a deletion of all child products.',
              },
            );
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
            joinKey: 'categoryId' as keyof AttachmentEntity,
            resourceId: ATTACHMENT_RESOURCE_ID,
          },
        },
      },
    }),
    loggerFeatureSetup(),
  ],
});
