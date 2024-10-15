import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { UserStatus } from '../enums/user-status.enum.js';

@Entity('user_status')
export class UserStatusEntity extends BaseEntity {
  @Column({ enum: UserStatus, type: 'enum', unique: true })
  name: UserStatus;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'integer' })
  cost: number;
}
