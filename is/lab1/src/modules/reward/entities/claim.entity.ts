import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { RewardEntity } from './reward.entity.js';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { ClaimStatus } from '../enums/claim-status.enum.js';

@Entity('claim')
export class ClaimEntity extends BaseEntity {
  @ManyToOne(() => RewardEntity)
  @JoinColumn({ name: 'reward_id' })
  reward: Relation<RewardEntity>;

  @Column({ name: 'reward_id', type: 'varchar' })
  rewardId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ enum: ClaimStatus, type: 'enum', default: ClaimStatus.Claimed })
  status: ClaimStatus;
}
