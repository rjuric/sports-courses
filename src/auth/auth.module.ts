import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { UsersModule } from '../users/users.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { Tokens } from './entities/tokens.entity';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Tokens]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
