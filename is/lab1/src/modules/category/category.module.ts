import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './category.controller.js';
import { CategoryService } from './category.service.js';
import { CategoryEntity } from './entities/category.entity.js';
import { SubCategoryEntity } from './entities/sub-category.entity.js';
import { SubSubCategoryEntity } from './entities/sub-sub-category.entity.js';

import { CryptoModule } from '../crypto/crypto.module.js';
import { ProductEntity } from '../product/entities/product.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      SubCategoryEntity,
      SubSubCategoryEntity,
      ProductEntity,
    ]),
    CryptoModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
