import { CategoryDto } from '../dto/category.dto.js';
import { SubSubCategoryEntity } from '../entities/sub-sub-category.entity.js';

export class SubSubCategoryAdapter {
  static toDto(entity: SubSubCategoryEntity): CategoryDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}
