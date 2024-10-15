import { UserStatusEntity } from '../entities/user-status.entity.js';

export type GetUserStatusInfoReturnType = {
  currentStatus: UserStatusEntity;
  pointsAmount: number;
  nextStatus?: UserStatusEntity;
};
