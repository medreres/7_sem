import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceConfig } from './datasource.js';
import { entities } from './entities.js';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceConfig)],
})
export class DbModule {
  // * For testing purposes only
  static forTest(schemaName: string): DynamicModule {
    return {
      module: DbModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'postgres',
              synchronize: true,
              // migrationsRun: true,
              entities,
              host: process.env.DATABASE_HOST,
              port: process.env.DATABASE_PORT,
              database: process.env.DATABASE_NAME,
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASSWORD,
              schema: schemaName,
            };
          },
        }),
      ],
    };
  }
}
