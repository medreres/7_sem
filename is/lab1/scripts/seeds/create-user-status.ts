import { DataSource } from 'typeorm';

import { UserStatusEntity } from '../../src/modules/user/entities/user-status.entity.js';
import { UserStatus } from '../../src/modules/user/enums/user-status.enum.js';

export const userStatuses = [
  {
    name: UserStatus.Bronze,
    cost: 0,
    description: 'started',
  },
  {
    name: UserStatus.Silver,
    cost: 15_000,
    description: 'advanced',
  },
  {
    name: UserStatus.Gold,
    cost: 50_000,
    description: 'top user',
  },
] as const satisfies Partial<UserStatusEntity>[];

export const createUserStatuses = async (
  dataSource: DataSource,
): Promise<void> => {
  try {
    console.debug('Creating user statuses...');

    const userStatusRepository = dataSource.getRepository(UserStatusEntity);

    await userStatusRepository.save(userStatuses);

    console.debug('Statuses have been created successfully!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
