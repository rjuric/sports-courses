import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { SignInDto } from '../users/dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import { Sender } from '../users/decorators/sender.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signUp(signUpDto);

    if (!result) {
      throw new BadRequestException();
    }

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto);

    if (!result) {
      throw new BadRequestException();
    }

    return result;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  signOut(@Sender() user: User) {
    return this.authService.signOut(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Sender() user: User) {
    return this.authService.refresh(user);
  }
}
