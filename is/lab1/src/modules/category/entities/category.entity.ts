import { Column, Entity, OneToMany } from 'typeorm';

import { SubCategoryEntity } from './sub-category.entity.js';

import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { WithAttachment } from '../../attachment/types/with-attachment.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { ProductEntity } from '../../product/entities/product.entity.js';

@Entity('category')
export class CategoryEntity extends BaseEntity implements WithAttachment {
  @Column({
    type: 'int',
    unique: true,
    nullable: false,
    name: 'internal_id',
  })
  internalCategoryId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isHidden: boolean;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.category)
  attachments?: AttachmentEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

  @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category)
  subCategories: SubCategoryEntity[];

  @Column('text', { array: true, default: ['#1B98A7', '#106169'] })
  colors: string[];

  @Column('text', { default: '#FFFFFF' })
  textColor: string;
}
