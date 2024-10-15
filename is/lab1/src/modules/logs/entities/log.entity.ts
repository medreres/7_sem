import { BeforeInsert, Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { prepareDateOfBirth } from '../utils/prepareDateOfBirth.js';

@Entity('logs')
export class LogEntity extends BaseEntity {
  @Column({ name: 'record_id', type: 'integer', nullable: false })
  public recordId: number;

  @Column({ name: 'record_title', type: 'text', nullable: true, default: '' })
  public recordTitle: string | null;

  @Column({ name: 'difference', type: 'jsonb', nullable: true, default: {} })
  public difference: string | null;

  @Column({ name: 'action', type: 'varchar', length: 128, nullable: false })
  public action: string;

  @Column({ name: 'resource', type: 'varchar', length: 128, nullable: false })
  public resource: string;

  @Column({ name: 'user_id', type: 'varchar', nullable: false })
  public userId: string;

  @BeforeInsert()
  formatDifference(): void {
    if (this.difference) {
      this.difference = prepareDateOfBirth(this.difference);
    }
  }
}
