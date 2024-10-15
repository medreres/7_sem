import { DataSource } from 'typeorm';

import { appConfig } from '../../../../config/app.js';

export const generateId = (length: number): string => {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const charactersLength = characters.length;

  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
};

/**
 * @description creates new schema in db to allow run tests in parallel, requires preloaded .env file with db connection params
 */
export const createNewSchema = async (): Promise<{ schema: string }> => {
  const mainConnection: DataSource = new DataSource({
    type: 'postgres',
    synchronize: true,
    migrationsRun: true,
    url: appConfig.databaseUrl,
  });

  await mainConnection.initialize();

  // eslint-disable-next-line no-magic-numbers -- length for schema name
  const schemaId: string = generateId(10).toLowerCase();

  await mainConnection.query(`CREATE SCHEMA ${schemaId}`);

  void mainConnection.destroy();

  return {
    schema: schemaId,
  };
};

export const dropSchema = async (schemaName: string): Promise<void> => {
  const connection = new DataSource({
    type: 'postgres',
    synchronize: true,
    migrationsRun: true,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });

  await connection.initialize();

  await connection.query(`DROP SCHEMA ${schemaName} CASCADE`);

  await connection.destroy();
};
