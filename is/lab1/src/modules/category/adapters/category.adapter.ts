import { AttachmentAdapter } from '../../attachment/adapters/attachment.adapter.js';
import { CategoryDto } from '../dto/category.dto.js';
import { CategoryEntity } from '../entities/category.entity.js';
import { SubCategoryEntity } from '../entities/sub-category.entity.js';
import { SubSubCategoryEntity } from '../entities/sub-sub-category.entity.js';

export class CategoryAdapter {
  static toDto(
    entity: CategoryEntity | SubCategoryEntity | SubSubCategoryEntity,
  ): CategoryDto {
    const category: Partial<CategoryDto> = {};

    if ('attachments' in entity) {
      category.attachments = entity.attachments?.map((attachment) =>
        AttachmentAdapter.toDto(attachment),
      );
    }

    if ('colors' in entity) {
      category.colors = entity.colors;
    }

    if ('textColor' in entity) {
      category.textColor = entity.textColor;
    }

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      ...category,
    };
  }
}
