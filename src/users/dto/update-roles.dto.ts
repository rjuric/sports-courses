import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../util/enums/role';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRolesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
