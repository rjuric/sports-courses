import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@automock/jest';
import { Role } from '../util/enums/role';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();
    controller = unit;
    service = unitRef.get(UsersService);
  });

  it('update throws 404 on null returned from service', async () => {
    service.update.mockResolvedValue(null);

    await expect(async () => {
      return await controller.updateRoles(1, {} as UpdateRolesDto);
    }).rejects.toThrow(NotFoundException);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('update returns with new roles', async () => {
    const newRoles = { roles: [Role.ADMIN, Role.USER] };
    service.update.mockResolvedValue(newRoles as User);

    const result = await controller.updateRoles(1, newRoles as UpdateRolesDto);

    expect(result).toEqual(newRoles);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('remove throws 404 on false returned from service', async () => {
    service.remove.mockResolvedValue(false);

    await expect(async () => {
      await controller.remove(1);
    }).rejects.toThrow(NotFoundException);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });

  it('remove returns on true returned from service', async () => {
    service.remove.mockResolvedValue(true);

    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
