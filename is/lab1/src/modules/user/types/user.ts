import { UserRole, UserStatus } from '../enums/user-status.enum.js';

export type User = {
  address: string;
  businessName: string;
  city: string;
  email: string;
  firstName: string;
  id: number;
  isActive: boolean;
  lastName: string;
  phone: string;
  pointsAmount: number;
  postalCode: string;
  role: UserRole;
  status: UserStatus;
  dateOfBirth?: Date;
};
