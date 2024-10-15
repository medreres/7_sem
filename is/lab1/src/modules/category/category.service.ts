import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetCategoriesInput } from './dto/get-categories/input.js';
import { GetCategoryInput } from './dto/get-category/input.dto.js';
import { CategoryEntity } from './entities/category.entity.js';
import { SubCategoryEntity } from './entities/sub-category.entity.js';
import { SubSubCategoryEntity } from './entities/sub-sub-category.entity.js';
import { GetCategoriesReturnType } from './types/get-categories.js';

import { ProductEntity } from '../product/entities/product.entity.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SubCategoryEntity)
    private readonly subCategoryRepository: Repository<SubCategoryEntity>,
    @InjectRepository(SubSubCategoryEntity)
    private readonly subSubCategoryRepository: Repository<SubSubCategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getCategories(
    query: GetCategoriesInput,
  ): Promise<GetCategoriesReturnType> {
    const { categoryId, subCategoryId } = query;

    if (categoryId && subCategoryId) {
      throw new BadRequestException(
        'either categoryId or subCategoryId should exists',
      );
    }

    const result: GetCategoriesReturnType = {
      totalProductsCount: 0,
      categories: [],
    };

    let countWhere = {};

    if (subCategoryId) {
      result.categories = await this.subSubCategoryRepository.find({
        where: { subCategoryId, isHidden: false },
      });

      countWhere = { subCategoryId };
    } else if (categoryId) {
      result.categories = await this.subCategoryRepository.find({
        where: { categoryId, isHidden: false },
      });

      countWhere = { categoryId };
    } else {
      result.categories = await this.categoryRepository.find({
        relations: ['attachments'],
        where: { isHidden: false },
      });
    }

    result.totalProductsCount = await this.productRepository.count({
      where: countWhere,
    });

    return result;
  }

  async getCategoryByIdOrFail(
    params: GetCategoryInput,
  ): Promise<CategoryEntity | SubCategoryEntity | SubSubCategoryEntity> {
    const { categoryId, subCategoryId, subSubCategoryId } = params;

    if (categoryId) {
      return this.categoryRepository.findOneOrFail({
        where: { id: categoryId, isHidden: false },
        relations: {
          attachments: true,
        },
      });
    }

    if (subCategoryId) {
      return this.subCategoryRepository.findOneOrFail({
        where: { id: subCategoryId, isHidden: false },
      });
    }

    if (subSubCategoryId) {
      return this.subSubCategoryRepository.findOneOrFail({
        where: { id: subSubCategoryId, isHidden: false },
      });
    }

    throw new Error('Should provide id for category');
  }
}
