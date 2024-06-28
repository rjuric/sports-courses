import 'dotenv/config';
import * as process from 'node:process';

export const configuration = () => {
  return {
    port: parseInt(process.env.PORT || '3000'),
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      access: {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      },
      refresh: {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      },
    },
  };
};
