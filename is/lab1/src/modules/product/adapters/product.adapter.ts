import { AttachmentAdapter } from '../../attachment/adapters/attachment.adapter.js';
import { CategoryAdapter } from '../../category/adapters/category.adapter.js';
import { ProductDto } from '../dto/product.dto.js';
import { ProductEntity } from '../entities/product.entity.js';

export class ProductAdapter {
  static toDto(entity: ProductEntity): ProductDto {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: entity.name,
      code: entity.code,
      productInternalId: entity.productInternalId,
      categoryId: entity.categoryId,
      subCategoryId: entity.subCategoryId,
      subSubCategoryId: entity.subSubCategoryId,
      description: entity.description,
      dataSheetUrl: entity.dataSheetUrl,
      instructionsUrl: entity.instructionsUrl,
      quickStartUrl: entity.quickStartUrl,
      isHidden: entity.isHidden,
      status: entity.status,
      category: CategoryAdapter.toDto(entity.category),
      subCategory: entity.subCategory
        ? CategoryAdapter.toDto(entity.subCategory)
        : undefined,
      subSubCategory: entity.subSubCategory
        ? CategoryAdapter.toDto(entity.subSubCategory)
        : undefined,
      characteristics:
        entity.characteristics?.map((characteristic) =>
          characteristic.toDto(),
        ) ?? [],
      attachments:
        entity.attachments?.map((attachment) =>
          AttachmentAdapter.toDto(attachment),
        ) ?? [],
    };
  }
}
