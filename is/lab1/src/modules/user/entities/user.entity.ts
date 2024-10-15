import { Length, Matches } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, VirtualColumn } from 'typeorm';

import { UserStatusEntity } from './user-status.entity.js';

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_REGEX_ERROR,
  PASSWORD_VALIDATION_REGEX,
  POSTAL_CODE_REGEX,
} from '../../auth/constants.js';
import { BaseEntity } from '../../common/entities/base-entity.entity.js';
import { Country } from '../enums/country.enum.js';
import { UserRole } from '../enums/user-status.enum.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in jsdoc
import type { UserService } from '../user.service.js';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: PASSWORD_LENGTH_ERROR,
  })
  @Matches(PASSWORD_VALIDATION_REGEX, {
    message: PASSWORD_REGEX_ERROR,
  })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'timestamptz', nullable: true })
  dateOfBirth?: Date;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  businessName: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255, enum: Country, default: Country.Uk })
  country: Country;

  @Column({ type: 'varchar', length: 10 })
  @Matches(POSTAL_CODE_REGEX)
  postalCode: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  /**
   * @deprecated virtual column does not work in further versions of typeorm use instead method of {@link UserService} `UserService.getPointsAmountByUserId`
   */
  // ! IMPORTANT @VirtualColumn is not stable and won't work in newer typeorm versions, replace it with service call
  @VirtualColumn({
    query: (alias) =>
      `SELECT COALESCE(SUM(amount), 0) FROM "point_transaction" WHERE "user_id" = ${alias}.id AND "created_at" >= ${alias}.last_reset_points_at`,
    transformer: {
      from: (value) => Number(value),
      to: (value) => Number(value),
    },
    type: 'int',
  })
  pointsAmount: number;

  @ManyToOne(() => UserStatusEntity)
  @JoinColumn({ name: 'user_status_id' })
  status: UserStatusEntity;

  @Column({ name: 'user_status_id', type: 'integer' })
  statusId: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column({
    name: 'device_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deviceToken?: string;

  @Column({
    name: 'last_reset_points_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastResetPointsAt: Date;
}
