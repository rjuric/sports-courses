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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Tokens } from './entities/tokens.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse({
    description: 'Email already in use, DTO validation failed.',
  })
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signUp(signUpDto);

    if (!result) {
      throw new BadRequestException();
    }

    return result;
  }

  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({
    description:
      "User not found, passwords don't match, DTO validation failed.",
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto);

    if (!result) {
      throw new BadRequestException();
    }

    return result;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Provided access token is invalid.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  signOut(@Sender() user: User) {
    return this.authService.signOut(user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: Tokens })
  @ApiUnauthorizedResponse({
    description: 'Provided refresh token is invalid.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Sender() user: User) {
    return this.authService.refresh(user);
  }
}
