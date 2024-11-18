import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { OrderEntity } from './order.entity.js';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { ProductEntity } from '../../product/entities/product.entity.js';

@Entity('order_item')
export class OrderItemEntity extends BaseEntity {
  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductEntity>;

  @Column({ name: 'product_id', type: 'integer' })
  productId: number;

  @ManyToOne(() => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Relation<OrderEntity>;

  @Column({ name: 'order_id', type: 'integer' })
  orderId: number;
}
