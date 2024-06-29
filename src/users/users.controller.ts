import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { Role } from '../util/enums/role';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Patch(':id/roles')
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    return this.usersService.update(id, updateRolesDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const didRemove = await this.usersService.remove(id);

    if (!didRemove) {
      throw new NotFoundException();
    }

    return;
  }
}
