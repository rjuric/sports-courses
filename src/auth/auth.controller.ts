import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { User } from '../users/entities/user.entity';
import { SignInDto } from '../users/dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    const user = new User();
    Object.assign(user, signUpDto);

    return user;
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    const user = new User();
    Object.assign(user, signInDto);

    return user;
  }

  @Post('refresh')
  refresh(@Headers('authorization') authHeader: string) {
    console.log(authHeader);
    return authHeader;
  }
}
