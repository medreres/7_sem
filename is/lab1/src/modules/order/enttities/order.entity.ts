import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { OrderItemEntity } from './order-item.entity.js';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: Relation<OrderItemEntity[]>;
}
