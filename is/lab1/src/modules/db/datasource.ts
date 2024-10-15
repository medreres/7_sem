import { DataSource, DataSourceOptions } from 'typeorm';

import { entities } from './entities.js';
import { Initial1728062331033 } from './migrations/1728062331033-initial.js';
import { AddFilesUrlToProduct1728644798952 } from './migrations/1728644798952-add-files-url-to-product.js';

import { appConfig } from '../config/app.js';
import { NodeEnv } from '../config/schema.js';

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.databaseUrl,
  synchronize: false,
  entities,
  migrations: [Initial1728062331033, AddFilesUrlToProduct1728644798952],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
  ssl:
    appConfig.nodeEnv === NodeEnv.Local || appConfig.nodeEnv === NodeEnv.Test
      ? false
      : {
          rejectUnauthorized: false,
        },
};

export const dataSource = new DataSource(dataSourceConfig);
