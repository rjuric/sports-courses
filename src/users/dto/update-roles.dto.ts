import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../util/enums/role';

export class UpdateRolesDto {
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
