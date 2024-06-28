import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { SignInDto } from '../users/dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
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

    newUser.tokens = await this.getTokens(newUser.id);

    return newUser.save();
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    user.tokens = await this.getTokens(user.id);
    const savedUser = await user.save();

    return savedUser.tokens;
  }

  async refresh(user: User) {
    user.tokens = await this.getTokens(user.id);
    return user.save();
  }

  private async hash(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async getTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generate(
        { userId },
        this.configService.get<string>('jwt.access.expiresIn')!,
      ),
      this.jwtService.generate(
        { userId },
        this.configService.get<string>('jwt.refresh.expiresIn')!,
      ),
    ]);

    return this.tokensRepository.create({
      accessToken,
      refreshToken,
    });
  }
}
