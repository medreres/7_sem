import { UserEntity } from '../entities/user.entity.js';

type AllowedFields = Partial<
  Pick<UserEntity, 'statusId' | 'lastResetPointsAt'>
>;

type EditUserData = AllowedFields;

export type EditUsersParams = {
  data: EditUserData;
  ids: number[];
};
