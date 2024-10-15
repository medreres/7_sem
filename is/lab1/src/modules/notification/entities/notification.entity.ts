import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { NotificationStatus } from '../enums/notification-status.enum.js';
import { NotificationType } from '../enums/notification-type.enum.js';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.Sent,
  })
  status: NotificationStatus;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToMany(() => AttachmentEntity)
  @JoinTable({
    name: 'notification_attachments',
    joinColumn: {
      name: 'attachment',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'notification',
      referencedColumnName: 'id',
    },
  })
  attachments: AttachmentEntity[];
}
