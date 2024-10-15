import { CategoryEntity } from '../entities/category.entity.js';
import { SubCategoryEntity } from '../entities/sub-category.entity.js';
import { SubSubCategoryEntity } from '../entities/sub-sub-category.entity.js';

export type GetCategoriesReturnType = {
  categories: CategoryEntity[] | SubCategoryEntity[] | SubSubCategoryEntity[];

  totalProductsCount: number;
};
