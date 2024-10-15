import { UserStatusDto } from '../dto/user-status.dto.js';

export type Status = {
  currentStatus: UserStatusDto;
  pointsAmount: number;
  nextStatus?: UserStatusDto;
};
