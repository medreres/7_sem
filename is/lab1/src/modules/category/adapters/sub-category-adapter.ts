import { CategoryDto } from '../dto/category.dto.js';
import { SubCategoryEntity } from '../entities/sub-category.entity.js';

export class SubCategoryAdapter {
  static toDto(entity: SubCategoryEntity): CategoryDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}
