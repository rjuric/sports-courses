import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../users/dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { PasswordsService } from '../passwords/passwords.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordsService: PasswordsService,
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.findByEmail(signUpDto.email);

    if (user) {
      return null;
    }

    const hashedPassword = await this.passwordsService.hash(signUpDto.password);
    const tokens = await this.getTokens(signUpDto.email);
    return this.usersService.create(signUpDto.email, hashedPassword, tokens);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      return null;
    }

    const isMatch = await this.passwordsService.compare(
      signInDto.password,
      user.password,
    );

    if (!isMatch) {
      return null;
    }

    user.tokens = await this.getTokens(user.email);
    return await user.save();
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
