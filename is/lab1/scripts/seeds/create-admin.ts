import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';

import { adminConfig } from '../../src/modules/config/admin.js';
import { CryptoService } from '../../src/modules/crypto/crypto.service.js';
import { PointTransactionEntity } from '../../src/modules/point-transaction/entities/point-transaction.entity.js';
import { UserEntity } from '../../src/modules/user/entities/user.entity.js';
import { UserStatusEntity } from '../../src/modules/user/entities/user-status.entity.js';
import { UserRole } from '../../src/modules/user/enums/user-status.enum.js';
import { UserService } from '../../src/modules/user/user.service.js';

export const createAdmin = async (dataSource: DataSource): Promise<void> => {
  try {
    console.debug('Creating admin...');

    const userService = new UserService(
      dataSource.getRepository(UserEntity),
      dataSource.getRepository(UserStatusEntity),
      dataSource.getRepository(PointTransactionEntity),
      new CryptoService(),
      new EventEmitter2(),
    );

    if (!adminConfig.email || !adminConfig.password) {
      throw new Error('No password or email');
    }

    await userService.createUser({
      email: adminConfig.email,
      password: adminConfig.password,
      address: 'admin',
      city: 'admin',
      businessName: 'admin',
      firstName: adminConfig.email,
      lastName: adminConfig.email,
      phone: adminConfig.email,
      postalCode: 'AA999AA',
      role: UserRole.Admin,
    });

    console.debug('Admin has been created successfully!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
