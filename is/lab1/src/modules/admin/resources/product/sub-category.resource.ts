import { ActionRequest, ResourceWithOptions, ValidationError } from 'adminjs';
import { Not } from 'typeorm';

import { CATEGORY_RESOURCE_ID } from './category.resource.js';
import { navigation } from './navigation.js';

import { CategoryEntity } from '../../../category/entities/category.entity.js';
import { SubCategoryEntity } from '../../../category/entities/sub-category.entity.js';
import { createSubCategorySchema } from '../../../category/schemas/create-sub-category.schema.js';
import { updateSubCategorySchema } from '../../../category/schemas/update-sub-category.schema.js';
import { ResourceProperties } from '../../types/resource-properties.js';
import { validateWithSchema } from '../../utils/validateSchema.js';
import { loggerFeatureSetup } from '../log/feature.js';

export const SUB_CATEGORY_RESOURCE_ID = 'Sub-Categories';

export const createSubCategoryResource = (): ResourceWithOptions => ({
  resource: SubCategoryEntity,
  options: {
    navigation,
    id: SUB_CATEGORY_RESOURCE_ID,
    properties: {
      id: { isVisible: false },
      categoryId: { isRequired: true, reference: CATEGORY_RESOURCE_ID },
      name: { isRequired: true },
      description: { isRequired: true },
      isHidden: { isRequired: true, type: 'boolean' },
    } satisfies ResourceProperties<SubCategoryEntity>,
    actions: {
      new: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as SubCategoryEntity;

          await validateWithSchema(createSubCategorySchema, request.payload);

          const existingCategory = await SubCategoryEntity.findOne({
            where: { name: payload.name },
          });

          if (existingCategory) {
            throw new ValidationError({
              name: { message: 'Subcategory with such name already exists.' },
            });
          }

          const category = await CategoryEntity.findOneOrFail({
            where: { id: payload.categoryId },
          });

          if (category.isHidden) {
            throw new ValidationError(
              {},
              {
                message: 'Subcategory couldn`t be created. Category is hidden.',
              },
            );
          }

          return request;
        },
      },
      edit: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as SubCategoryEntity;
          const subCategoryId = Number(request.params.recordId);

          if (request.method === 'post') {
            await validateWithSchema(updateSubCategorySchema, payload);

            const existingSubCategory = await SubCategoryEntity.findOne({
              where: {
                name: payload.name,
                id: Not(subCategoryId),
              },
            });

            if (existingSubCategory) {
              throw new ValidationError({
                name: { message: 'Subcategory with such name already exists.' },
              });
            }

            const category = await CategoryEntity.findOneOrFail({
              where: { id: payload.categoryId },
            });

            if (category.isHidden) {
              throw new ValidationError(
                {},
                {
                  message:
                    'Subcategory couldn`t be created. Category is hidden.',
                },
              );
            }

            const subCategory = await SubCategoryEntity.findOneOrFail({
              where: { id: subCategoryId },
              relations: ['subSubCategories', 'products'],
            });

            // if admin want to hide subCategory
            if (!subCategory.isHidden && payload.isHidden === true) {
              const isUpdateAllowedFromSub = subCategory.subSubCategories.every(
                (subSubCategory) => {
                  if (!subSubCategory.isHidden) {
                    return false;
                  }

                  return true;
                },
              );

              const isUpdateAllowedFromProducts = subCategory.products.every(
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
                      'Subcategory couldn`t be hidden without a hide of all child entities.',
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
          const subCategoryId = Number(request.params.recordId);

          const subCategory = await SubCategoryEntity.findOneOrFail({
            where: { id: subCategoryId },
            relations: ['subSubCategories', 'products'],
          });

          if (subCategory.subSubCategories.length > 0) {
            throw new ValidationError(
              {},
              {
                message:
                  'Subcategory couldn`t be deleted without a deletion of all child sub-sub-categories.',
              },
            );
          }

          if (subCategory.products.length > 0) {
            throw new ValidationError(
              {},
              {
                message:
                  'Subcategory couldn`t be deleted without a deletion of all child products.',
              },
            );
          }

          return request;
        },
      },
    },
  },
  features: [loggerFeatureSetup()],
});
