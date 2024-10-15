import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { CategoryEntity } from '../../category/entities/category.entity.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { InvoiceEntity } from '../../invoice/entities/invoice.entity.js';
import { ProductEntity } from '../../product/entities/product.entity.js';
import { RewardEntity } from '../../reward/entities/reward.entity.js';

export enum AttachmentEntityType {
  Product = 'product',
  Category = 'category',
}

@Entity('attachment')
export class AttachmentEntity extends BaseEntity {
  @Column({ name: 'file_url', type: 'varchar' })
  fileUrl: string;

  @ManyToOne(() => CategoryEntity, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category?: Relation<CategoryEntity>;

  @Column({ type: 'integer', name: 'category_id', nullable: true })
  categoryId?: number;

  @ManyToOne(() => RewardEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reward_id' })
  reward?: Relation<RewardEntity>;

  @Column({
    type: 'integer',
    name: 'reward_id',
    nullable: true,
  })
  rewardId?: number;

  @ManyToOne(() => ProductEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product?: Relation<ProductEntity>;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId?: number;

  @ManyToOne(() => InvoiceEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice?: Relation<InvoiceEntity>;

  @Column({ type: 'integer', name: 'invoice_id', nullable: true })
  invoiceId?: number;
}
