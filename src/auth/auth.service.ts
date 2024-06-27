import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { SignInDto } from '../users/dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}

  async signUp(createUserDto: SignUpDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new BadRequestException('User already exists.');
    }

    const hashedPassword = await this.hash(createUserDto.password);
    const newUser = this.usersService.create(
      createUserDto.email,
      hashedPassword,
    );

    const tokens = await this.getTokens(newUser.id);
    newUser.tokens = this.tokensRepository.create(tokens);

    return newUser.save();
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    const tokens = await this.getTokens(user.id);
    user.tokens = this.tokensRepository.create(tokens);
    const savedUser = await user.save();

    return savedUser.tokens;
  }

  private async hash(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async getTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('jwt.access.secret'),
          expiresIn: this.configService.get<string>('jwt.access.expiresIn'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('jwt.refresh.secret'),
          expiresIn: this.configService.get<string>('jwt.refresh.expiresIn'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
