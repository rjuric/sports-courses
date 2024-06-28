import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectUser } from './users/middleware/inject-user.middleware';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    UsersModule,
    ClassesModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: ['./**/*.entity.js'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectUser).forRoutes('/');
  }
}
