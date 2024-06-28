import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Tokens } from './entities/tokens.entity';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  providers: [AuthService],
  imports: [UsersModule, JwtModule, TypeOrmModule.forFeature([Tokens])],
  controllers: [AuthController],
})
export class AuthModule {}
