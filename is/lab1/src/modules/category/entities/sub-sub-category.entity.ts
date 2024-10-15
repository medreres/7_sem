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

import { SubCategoryEntity } from './sub-category.entity.js';

import { ProductEntity } from '../../product/entities/product.entity.js';

@Entity('sub_sub_category')
export class SubSubCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubCategoryEntity)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: Relation<SubCategoryEntity>;

  @Column({ type: 'int' })
  subCategoryId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isHidden: boolean;

  @OneToMany(() => ProductEntity, (product) => product.subSubCategory)
  products: Relation<ProductEntity[]>;
}
