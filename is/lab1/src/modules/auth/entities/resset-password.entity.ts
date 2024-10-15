import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';

@Entity('reset_password_code')
export class ResetPasswordCodeEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'varchar' })
  code: string;
}
