import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@automock/jest';
import { Role } from '../util/enums/role';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let sut: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();
    sut = unit;
    service = unitRef.get(UsersService);
  });

  it('update throws 404 on null returned from service', async () => {
    service.update.mockResolvedValue(null);

    await expect(async () => {
      return await sut.updateRoles(1, {} as UpdateRolesDto);
    }).rejects.toThrow(NotFoundException);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('update returns with new roles', async () => {
    const newRoles = { roles: [Role.ADMIN, Role.USER] };
    service.update.mockResolvedValue(newRoles as User);

    const result = await sut.updateRoles(1, newRoles as UpdateRolesDto);

    expect(result).toEqual(newRoles);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('remove throws 404 on false returned from service', async () => {
    service.remove.mockResolvedValue(false);

    await expect(async () => {
      await sut.remove(1);
    }).rejects.toThrow(NotFoundException);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });

  it('remove returns on true returned from service', async () => {
    service.remove.mockResolvedValue(true);

    await sut.remove(1);

    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
