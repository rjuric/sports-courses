import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { User } from '../users/entities/user.entity';
import { SignInDto } from '../users/dto/sign-in.dto';

@Injectable()
export class AuthService {
  signUp(signUpDto: SignUpDto) {
    const user = new User();
    Object.assign(user, signUpDto);

    return user;
  }

  signIn(signInDto: SignInDto) {
    const user = new User();
    Object.assign(user, signInDto);

    return user;
  }

  findOne(id: number) {}
}
