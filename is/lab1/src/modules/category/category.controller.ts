import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CategoryService } from './category.service.js';
import { CategoryDto } from './dto/category.dto.js';
import { GetCategoriesInput } from './dto/get-categories/input.js';
import { GetCategoriesOutput } from './dto/get-categories/output.js';
import { GetCategoryInput } from './dto/get-category/input.dto.js';
import { CategoryEntity } from './entities/category.entity.js';
import { SubCategoryEntity } from './entities/sub-category.entity.js';
import { SubSubCategoryEntity } from './entities/sub-sub-category.entity.js';
import getCategoryDto from './utils/get-category-adapter.js';

import { UserGuard } from '../auth/guards/user.guard.js';
import { ErrorOutput } from '../common/dto/error.output.js';

@UseGuards(UserGuard)
@ApiTags('Categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('child-categories')
  @ApiOkResponse({
    type: GetCategoriesOutput,
    description: 'Categories successfully fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query param.',
    type: ErrorOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async getCategoriesHandler(
    @Query() query: GetCategoriesInput,
  ): Promise<GetCategoriesOutput> {
    const { totalProductsCount, categories } =
      await this.categoryService.getCategories(query);

    return {
      totalProductsCount,
      categories: categories.map(
        (category: CategoryEntity | SubCategoryEntity | SubSubCategoryEntity) =>
          getCategoryDto(category),
      ),
    };
  }

  @ApiOkResponse({
    type: CategoryDto,
    description: 'Category with given id',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query param.',
    type: ErrorOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Get('categories')
  async getCategory(@Query() query: GetCategoryInput): Promise<CategoryDto> {
    const category = await this.categoryService.getCategoryByIdOrFail(query);

    return getCategoryDto(category);
  }
}
