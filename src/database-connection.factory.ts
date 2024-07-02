import { ConfigService } from '@nestjs/config';

export const databaseConnectionFactory = (configService: ConfigService) => {
  const connection = {
    synchronize: true,
  };

  if (configService.get<string>('NODE_ENV') == 'test') {
    Object.assign(connection, {
      type: 'sqlite',
      dropSchema: true,
      database: 'test.db.sqlite',
      entities: ['**/*.entity.ts'],
    });
  } else {
    Object.assign(connection, {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      username: configService.get<string>('DB_USERNAME'),
      entities: ['**/*.entity.js'],
    });
  }

  return connection;
};
