import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { InvoiceEntity } from '../../invoice/entities/invoice.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';

@Entity('point_transaction')
export class PointTransactionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToOne(() => InvoiceEntity, { nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice?: Relation<InvoiceEntity>;

  @Column({ name: 'invoice_id', type: 'integer', nullable: true })
  invoiceId?: number;
}
