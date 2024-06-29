import { Injectable } from '@nestjs/common';
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
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) {
      return null;
    }

    const hashedPassword = await this.hash(createUserDto.password);
    const tokens = await this.getTokens(createUserDto.email);
    return this.usersService.create(
      createUserDto.email,
      hashedPassword,
      tokens,
    );
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      return null;
    }

    user.tokens = await this.getTokens(user.email);
    const savedUser = await user.save();

    return savedUser.tokens;
  }

  async signOut(user: User) {
    await user.tokens?.remove();
    return;
  }

  async refresh(user: User) {
    user.tokens = await this.getTokens(user.email);
    const saved = await user.save();
    return saved.tokens;
  }

  private async hash(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async getTokens(email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generate(
        { email },
        this.configService.get<string>('jwt.access.expiresIn')!,
      ),
      this.jwtService.generate(
        { email },
        this.configService.get<string>('jwt.refresh.expiresIn')!,
      ),
    ]);

    return this.tokensRepository.create({
      accessToken,
      refreshToken,
    });
  }
}
