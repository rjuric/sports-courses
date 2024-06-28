import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User as UserEntity } from '../../users/entities/user.entity';

export const Sender = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().body.user as UserEntity;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);
