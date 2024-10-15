import { Column, Entity, OneToMany } from 'typeorm';

import { ClaimEntity } from './claim.entity.js';

import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { WithAttachment } from '../../attachment/types/with-attachment.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';

@Entity('reward')
export class RewardEntity extends BaseEntity implements WithAttachment {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', name: 'term_of_use', nullable: true })
  termOfUse?: string;

  @Column({ type: 'integer' })
  cost: number;

  // * Should contain only one attachment for now
  @OneToMany(() => AttachmentEntity, (attachment) => attachment.reward)
  attachments?: AttachmentEntity[];

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @OneToMany(() => ClaimEntity, (claim) => claim.reward)
  claims: ClaimEntity[];
}
