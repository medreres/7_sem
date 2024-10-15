import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SearchProductsInput } from './dto/search-products/input.js';
import { ProductEntity } from './entities/product.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findProductByIdOrFail(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'characteristics',
        'attachments',
        'category.attachments',
        'subCategory',
        'subSubCategory',
        'subCategory',
      ],
    });

    if (!product) {
      throw new BadRequestException('Product with provided id not found.');
    }

    return product;
  }

  async searchProducts(
    query: SearchProductsInput,
  ): Promise<{ itemsCount: number; products: ProductEntity[] }> {
    const { page, take, shouldSortByNewFirst, ...filterQuery } = query;

    const [products, count] = await this.productRepository.findAndCount({
      where: { ...filterQuery, isHidden: false },
      relations: {
        attachments: true,
        category: true,
        subCategory: true,
        subSubCategory: true,
        characteristics: true,
      },
      // if shouldSortByNewFirst equals true, than order by status, products with status 'new' will be first (should consider on ProductStatus enum values)
      order: {
        // TODO fix to include only with status new
        status: shouldSortByNewFirst ? 'asc' : undefined,
        productInternalId: 'asc',
      },
      skip: (page - 1) * take,
      take,
    });

    return { products, itemsCount: count };
  }
}
