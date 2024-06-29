import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const Sender = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as User;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);
