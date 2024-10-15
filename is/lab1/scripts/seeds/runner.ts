import { createAdmin } from './create-admin.js';
import { createShops } from './create-shops.js';
import { createUserStatuses } from './create-user-status.js';

import { dataSource } from '../../src/modules/db/datasource.js';

const runSeed = async (): Promise<void> => {
  try {
    console.debug('Connecting to the database...');

    await dataSource.initialize();

    console.debug('Connected! Running seeds...');

    await createUserStatuses(dataSource);
    await createAdmin(dataSource);
    await createShops(dataSource);

    await dataSource.destroy();

    console.debug('Seeds have been run successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void runSeed();
