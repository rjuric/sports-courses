import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const Admin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().body.user as User;

    if (!user || !user.isAdmin) {
      throw new ForbiddenException();
    }

    return user;
  },
);
