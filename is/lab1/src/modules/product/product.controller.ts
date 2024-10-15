import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProductAdapter } from './adapters/product.adapter.js';
import { ProductDto } from './dto/product.dto.js';
import { SearchProductsInput } from './dto/search-products/input.js';
import { SearchProductsOutput } from './dto/search-products/output.js';
import { ProductService } from './product.service.js';

import { UserGuard } from '../auth/guards/user.guard.js';
import { ErrorOutput } from '../common/dto/error.output.js';
import { preparePageResult } from '../common/utils/page-result.js';

@UseGuards(UserGuard)
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:id')
  @ApiOkResponse({
    type: ProductDto,
    description: 'Product successfully fetched by id.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid product id',
    type: ErrorOutput,
  })
  async getProductHandler(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductDto> {
    const product = await this.productService.findProductByIdOrFail(id);

    return ProductAdapter.toDto(product);
  }

  @Get()
  @ApiOkResponse({
    type: () => SearchProductsOutput,
    description: 'Products successfully found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid product id',
    type: ErrorOutput,
  })
  async searchProductsHandler(
    @Query() query: SearchProductsInput,
  ): Promise<SearchProductsOutput> {
    const { products, itemsCount } =
      await this.productService.searchProducts(query);

    const result = preparePageResult<ProductDto>(
      query,
      itemsCount,
      products.map((product) => ProductAdapter.toDto(product)),
    );

    return result;
  }
}
