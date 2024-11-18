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
import { OrderStatus } from '../enum/order-status.enum.js';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
  orderStatus: OrderStatus;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: Relation<OrderItemEntity[]>;
}
