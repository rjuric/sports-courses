import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InjectSenderMiddleware } from './users/middlewares/inject-sender.middleware';
import { PasswordsModule } from './passwords/passwords.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ClassesModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => {
        if (process.env.NODE_ENV !== 'test') {
          return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            entities: ['**/*.entity.js'],
            synchronize: true,
          };
        } else {
          return {
            type: 'sqlite',
            database: 'test.db.sqlite',
            entities: ['**/*.entity.js'],
            synchronize: true,
          };
        }
      },
    }),
    JwtModule,
    PasswordsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectSenderMiddleware).forRoutes('/');
  }
}
