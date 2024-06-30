import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { TestBed } from '@automock/jest';
import { FindAllClassesDto } from './dto/find-all-classes.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';
import { ApplyToClassDto } from './dto/apply-to-class.dto';

describe('ClassesController', () => {
  let controller: ClassesController;
  let service: jest.Mocked<ClassesService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.create(ClassesController).compile();
    controller = unit;
    service = unitRef.get(ClassesService);
  });

  it('find calls the service with correct parameters', async () => {
    const dto = { sports: 'tennis,soccer,basketball' } as FindAllClassesDto;

    await controller.find(dto);

    expect(service.find).toHaveBeenCalledWith([
      'tennis',
      'soccer',
      'basketball',
    ]);
  });

  it('findOne throws not found exception on null returned from service', async () => {
    service.findOne.mockResolvedValue(null);

    await expect(async () => {
      await controller.findOne(1);
    }).rejects.toThrow(NotFoundException);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('findOne returns correct result from service', async () => {
    const mockedClass = {
      id: 1,
      description: 'some class description',
    } as Class;
    service.findOne.mockResolvedValue(mockedClass);

    const result = await controller.findOne(1);

    expect(result).toStrictEqual(mockedClass);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('apply throws 404 on null returned from service', async () => {
    service.apply.mockResolvedValue(null);
    const mockedUser = {} as User;
    const mockedDto = {} as ApplyToClassDto;

    await expect(async () => {
      await controller.apply(1, mockedUser, mockedDto);
    }).rejects.toThrow(NotFoundException);
    expect(service.apply).toHaveBeenCalledTimes(1);
  });
});
