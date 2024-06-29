import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../../util/enums/role';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: Role[]) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return false;
    }

    return this.roles.filter((role) => user.roles.includes(role)).length > 0;
  }
}
