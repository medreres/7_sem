import { UserEntity } from '../../../../modules/user/entities/user.entity.js';
import { UserRole } from '../../../../modules/user/enums/user-status.enum.js';

export const createMockUser = (): UserEntity => {
  const user = {
    email: Math.random().toString(36),
    password: Math.random().toString(36),
    address: Math.random().toString(36),
    city: Math.random().toString(36),
    businessName: Math.random().toString(36),
    firstName: Math.random().toString(36),
    lastName: Math.random().toString(36),
    phone: Math.random().toString(36),
    postalCode: 'AA999AA',
    role: UserRole.Admin,
  } as UserEntity;

  return user;
};
