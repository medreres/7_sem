import { ActionRequest, ResourceWithOptions, ValidationError } from 'adminjs';
import { Not } from 'typeorm';

import { navigation } from './navigation.js';
import { SUB_CATEGORY_RESOURCE_ID } from './sub-category.resource.js';

import { SubCategoryEntity } from '../../../category/entities/sub-category.entity.js';
import { SubSubCategoryEntity } from '../../../category/entities/sub-sub-category.entity.js';
import { createSubSubCategorySchema } from '../../../category/schemas/create-sub-sub-category.schema.js';
import { updateSubSubCategorySchema } from '../../../category/schemas/update-sub-sub-category.schema.js';
import { ResourceProperties } from '../../types/resource-properties.js';
import { validateWithSchema } from '../../utils/validateSchema.js';
import { loggerFeatureSetup } from '../log/feature.js';

export const SUB_SUB_CATEGORY_RESOURCE_ID = 'Sub-SubCategories';

export const createSubSubCategoryResource = (): ResourceWithOptions => ({
  resource: SubSubCategoryEntity,
  options: {
    navigation,
    id: SUB_SUB_CATEGORY_RESOURCE_ID,
    properties: {
      id: { isVisible: false },
      subCategoryId: { isRequired: true, reference: SUB_CATEGORY_RESOURCE_ID },
      name: { isRequired: true },
      description: { isRequired: true },
      isHidden: { isRequired: true, type: 'boolean' },
    } satisfies ResourceProperties<SubSubCategoryEntity>,
    actions: {
      new: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as SubSubCategoryEntity;

          await validateWithSchema(createSubSubCategorySchema, payload);

          const existingSubSubCategory = await SubSubCategoryEntity.findOne({
            where: { name: payload.name },
          });

          if (existingSubSubCategory) {
            throw new ValidationError({
              name: {
                message: 'Sub-Subcategory with such name already exists.',
              },
            });
          }

          const subCategory = await SubCategoryEntity.findOneOrFail({
            where: { id: payload.subCategoryId },
          });

          if (subCategory.isHidden) {
            throw new ValidationError(
              {},
              {
                message:
                  'Sub-Subcategory couldn`t be created. Subcategory is hidden.',
              },
            );
          }

          return request;
        },
      },
      edit: {
        before: async (request: ActionRequest) => {
          const payload = request.payload as SubSubCategoryEntity;
          const subSubCategoryId = Number(request.params.recordId);

          if (request.method === 'post') {
            await validateWithSchema(updateSubSubCategorySchema, payload);

            const existingSubSubCategory = await SubSubCategoryEntity.findOne({
              where: {
                name: payload.name,
                id: Not(subSubCategoryId),
              },
            });

            if (existingSubSubCategory) {
              throw new ValidationError({
                name: {
                  message: 'Sub-Subcategory with such name already exists.',
                },
              });
            }

            const subSubCategory = await SubSubCategoryEntity.findOneOrFail({
              where: { id: subSubCategoryId },
              relations: ['products'],
            });

            // if admin want to hide subSubCategory
            if (!subSubCategory.isHidden && payload.isHidden === true) {
              const isUpdateAllowed = subSubCategory.products.every(
                (product) => {
                  if (!product.isHidden) {
                    return false;
                  }

                  return true;
                },
              );

              if (!isUpdateAllowed) {
                throw new ValidationError(
                  {},
                  {
                    message:
                      'Sub-Subcategory couldn`t be hidden without a hide of all child products.',
                  },
                );
              }
            }

            const subCategory = await SubCategoryEntity.findOneOrFail({
              where: { id: payload.subCategoryId },
            });

            if (subCategory.isHidden) {
              throw new ValidationError(
                {},
                {
                  message:
                    'Sub-Subcategory couldn`t be updated. Subcategory is hidden.',
                },
              );
            }
          }

          return request;
        },
      },
      delete: {
        before: async (request: ActionRequest) => {
          const subSubCategoryId = Number(request.params.recordId);

          const subSubCategory = await SubSubCategoryEntity.findOneOrFail({
            where: { id: subSubCategoryId },
            relations: ['products'],
          });

          if (subSubCategory.products.length > 0) {
            throw new ValidationError(
              {},
              {
                message:
                  'Sub-Subcategory couldn`t be deleted without a deletion of all child products.',
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
