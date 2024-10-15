import { createCategoryResource } from './category.resource.js';
import { createProductResource } from './product/product.resource.js';
import { createProductCharacteristicResource } from './product-characteristic.resource.js';
import { createSubCategoryResource } from './sub-category.resource.js';
import { createSubSubCategoryResource } from './sub-sub-category.resource.js';

export default [
  createCategoryResource,
  createSubCategoryResource,
  createSubSubCategoryResource,
  createProductResource,
  createProductCharacteristicResource,
];
