import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { CategoryEntity } from './category.entity.js';
import { SubSubCategoryEntity } from './sub-sub-category.entity.js';

import { ProductEntity } from '../../product/entities/product.entity.js';

@Entity('sub_category')
export class SubCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: Relation<CategoryEntity>;

  @Column({ type: 'integer' })
  categoryId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isHidden: boolean;

  @OneToMany(
    () => SubSubCategoryEntity,
    (subSubCategory) => subSubCategory.subCategory,
  )
  subSubCategories: Relation<SubSubCategoryEntity[]>;

  @OneToMany(() => ProductEntity, (product) => product.subCategory)
  products: Relation<ProductEntity[]>;
}
