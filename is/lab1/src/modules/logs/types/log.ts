import { BaseEntity } from '../../common/entities/base-entity.entity.js';

export interface Log extends BaseEntity {
  action: string;
  difference: string | null;
  recordId: number;
  recordTitle: string | null;
  resource: string;
  userId: string | null;
}

export interface LogDifference {
  after: string;
  before: string;
}
