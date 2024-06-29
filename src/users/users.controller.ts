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
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Access token is invalid.' })
  @ApiForbiddenResponse({ description: 'Sender is not ADMIN.' })
  @ApiOkResponse({ description: 'Updated  roles.' })
  @Patch(':id/roles')
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    return this.usersService.update(id, updateRolesDto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Access token is invalid.' })
  @ApiForbiddenResponse({ description: 'Sender is not ADMIN.' })
  @ApiNoContentResponse({ description: 'Successfully deleted user.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const didRemove = await this.usersService.remove(id);

    if (!didRemove) {
      throw new NotFoundException();
    }

    return;
  }
}
