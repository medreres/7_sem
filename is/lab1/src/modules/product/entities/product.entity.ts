import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { ProductCharacteristicEntity } from './product-characteristic.entity.js';

import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { WithAttachment } from '../../attachment/types/with-attachment.js';
import { CategoryEntity } from '../../category/entities/category.entity.js';
import { SubCategoryEntity } from '../../category/entities/sub-category.entity.js';
import { SubSubCategoryEntity } from '../../category/entities/sub-sub-category.entity.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { ProductStatus } from '../enum/product-status.enum.js';

@Entity('product')
export class ProductEntity extends BaseEntity implements WithAttachment {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  code: string;

  @Column({ type: 'int' })
  price: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  productInternalId: string;

  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @Column({ type: 'int', nullable: true })
  subCategoryId?: number;

  @Column({ type: 'int', nullable: true })
  subSubCategoryId?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  dataSheetUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  quickStartUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  instructionsUrl?: string;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ enum: ProductStatus, nullable: true, type: 'enum' })
  status?: ProductStatus;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: Relation<CategoryEntity>;

  @ManyToOne(() => SubCategoryEntity, { nullable: true })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory?: Relation<SubCategoryEntity>;

  @ManyToOne(() => SubSubCategoryEntity, { nullable: true })
  @JoinColumn({ name: 'subSubCategoryId' })
  subSubCategory?: Relation<SubSubCategoryEntity>;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.product)
  attachments: AttachmentEntity[];

  @OneToMany(
    () => ProductCharacteristicEntity,
    (characteristic) => characteristic.product,
  )
  characteristics: Relation<ProductCharacteristicEntity[]>;
}
