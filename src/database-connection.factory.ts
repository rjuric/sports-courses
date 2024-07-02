import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import * as process from 'node:process';

export const databaseConnectionFactory = () => {
  const connection = {
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
  };

  if (process.env.NODE_ENV == 'test') {
    Object.assign(connection, {
      type: 'sqlite',
      dropSchema: true,
      database: 'test.db.sqlite',
      entities: ['**/*.entity.ts'],
    });
  } else {
    Object.assign(connection, {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      entities: ['**/*.entity.js'],
    });
  }

  return connection;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export default new DataSource(databaseConnectionFactory() as DataSourceOptions);
