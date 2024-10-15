import { UserEntity } from '../entities/user.entity.js';

export type CreateUserParams = Pick<
  UserEntity,
  | 'email'
  | 'password'
  | 'firstName'
  | 'lastName'
  | 'address'
  | 'postalCode'
  | 'city'
  | 'businessName'
  | 'phone'
  | 'role'
  | 'dateOfBirth'
> &
  Partial<Pick<UserEntity, 'statusId' | 'createdAt' | 'lastResetPointsAt'>>;
