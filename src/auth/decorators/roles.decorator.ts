import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../../util/enums/role';
import { RolesGuard } from '../guards/roles.guard';

export const Roles = (...roles: Role[]) =>
  applyDecorators(UseGuards(new RolesGuard(roles)));
