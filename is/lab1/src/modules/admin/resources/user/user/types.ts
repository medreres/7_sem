import { UserEntity } from '../../../../user/entities/user.entity.js';

export type ExtendedUser = UserEntity & { newPassword?: string };
