import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { WithAttachment } from '../../attachment/types/with-attachment.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { PointTransactionEntity } from '../../point-transaction/entities/point-transaction.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { InvoiceStatus } from '../enums/invoice-status.enum.js';

@Entity('invoice')
export class InvoiceEntity extends BaseEntity implements WithAttachment {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.invoice)
  attachments?: AttachmentEntity[];

  @Column({ enum: InvoiceStatus, default: InvoiceStatus.Open, type: 'enum' })
  status: InvoiceStatus;

  @Column({ type: 'timestamptz', name: 'issued_at', nullable: true })
  issuedAt?: Date;

  @OneToOne(() => PointTransactionEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'transaction_id' })
  pointTransaction?: Relation<PointTransactionEntity>;

  @Column({ name: 'transaction_id', nullable: true, type: 'integer' })
  pointTransactionId?: number;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason?: string;
}
