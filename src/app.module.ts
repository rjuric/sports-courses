import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
  NestModule,
} from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InjectSenderMiddleware } from './users/middlewares/inject-sender.middleware';
import { PasswordsModule } from './passwords/passwords.module';
import { databaseConnectionFactory } from './database-connection.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ClassesModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return databaseConnectionFactory(configService);
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
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectSenderMiddleware).forRoutes('/');
  }
}
