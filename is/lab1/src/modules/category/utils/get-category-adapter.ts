import { CategoryAdapter } from '../adapters/category.adapter.js';
import { SubCategoryAdapter } from '../adapters/sub-category-adapter.js';
import { SubSubCategoryAdapter } from '../adapters/sub-sub-category-adapter.js';
import { CategoryDto } from '../dto/category.dto.js';
import { CategoryEntity } from '../entities/category.entity.js';
import { SubCategoryEntity } from '../entities/sub-category.entity.js';
import { SubSubCategoryEntity } from '../entities/sub-sub-category.entity.js';

export default function getCategoryDto(
  entity: CategoryEntity | SubCategoryEntity | SubSubCategoryEntity,
): CategoryDto {
  if (entity instanceof SubCategoryEntity) {
    return SubCategoryAdapter.toDto(entity);
  }

  if (entity instanceof SubSubCategoryEntity) {
    return SubSubCategoryAdapter.toDto(entity);
  }

  if (entity instanceof CategoryEntity) {
    return CategoryAdapter.toDto(entity);
  }

  throw new Error('No adapter found for the provided entity');
}
