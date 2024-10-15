import { User } from './user.js';

import { UserEntity } from '../entities/user.entity.js';

type AllowedFields = Partial<
  Omit<User, 'id' | 'password' | 'status' | 'pointsAmount'> &
    Pick<UserEntity, 'statusId' | 'deviceToken'>
>;

type EditUserData = AllowedFields & {
  newPassword?: string;
  oldPassword?: string;
};

export type EditUserParams = {
  data: EditUserData;
  id: number;
};
