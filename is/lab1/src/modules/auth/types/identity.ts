import { User } from '../../user/types/user.js';

export type Identity = Pick<User, 'id' | 'role' | 'isActive'>;
