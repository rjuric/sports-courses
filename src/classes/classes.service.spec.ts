import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateClassDto, CreateClassScheduleDto } from './dto/create-class.dto';
import { DayOfWeek } from '../util/enums/day-of.week';
import { Role } from '../util/enums/role';

const footballDto = new CreateClassDto(
  'football',
  'a sport where the ball is kicked',
  90,
  [new CreateClassScheduleDto(DayOfWeek.MONDAY, '18:00:00')],
);

const basketballDto = new CreateClassDto(
  'basketball',
  'a sport where the ball is bounced',
  90,
  [new CreateClassScheduleDto(DayOfWeek.MONDAY, '18:00:00')],
);

const football = new Class();
Object.assign(football, footballDto);

const basketball = new Class();
Object.assign(basketball, basketballDto);

describe('ClassesService', () => {
  let sut: ClassesService;
  let repository: Repository<Class>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: getRepositoryToken(Class),
          useValue: {
            create: jest.fn().mockImplementation((data: CreateClassDto) => {
              const entity = new Class();
              Object.assign(entity, data);
              return entity;
            }),
            save: jest
              .fn()
              .mockImplementation(
                async (entity: Class): Promise<Class> => entity,
              ),
            find: jest
              .fn()
              .mockImplementation(async (): Promise<Class[]> => [football]),
            findOne: jest.fn().mockImplementation(async () => {
              return null;
            }),
            delete: jest.fn().mockImplementation(async () => {
              return { affected: 0 };
            }),
          },
        },
      ],
    }).compile();

    sut = module.get<ClassesService>(ClassesService);
    repository = module.get<Repository<Class>>(getRepositoryToken(Class));
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('creates a new class', async () => {
      const result = await sut.create(footballDto);

      expect(result).toBeDefined();
    });
  });

  describe('find', () => {
    it('returns all classes when no sports undefined', async () => {
      repository.find = jest.fn().mockResolvedValueOnce([football, basketball]);

      const result = await sut.find([]);

      expect(result).toStrictEqual([football, basketball]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: { schedule: true },
      });
    });

    it('returns all classes when no sports are sent', async () => {
      repository.find = jest.fn().mockResolvedValueOnce([football, basketball]);

      const result = await sut.find([]);

      expect(result).toStrictEqual([football, basketball]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: { schedule: true },
      });
    });

    it('returns matching classes when sports are sent', async () => {
      repository.find = jest.fn().mockResolvedValueOnce([football]);

      const result = await sut.find(['football']);

      expect(result).toStrictEqual([football]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: { schedule: true },
        where: { sport: In(['football']) },
      });
    });

    it('returns matching classes when more sports are sent', async () => {
      repository.find = jest.fn().mockResolvedValueOnce([football]);

      const result = await sut.find(['football', 'basketball']);

      expect(result).toStrictEqual([football]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: { schedule: true },
        where: { sport: In(['football', 'basketball']) },
      });
    });
  });

  describe('findOne', () => {
    it('returns null when no class is found', async () => {
      const result = await sut.findOne(1);

      expect(result).toBeNull();
    });

    it('returns class when it exists', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(football);

      const result = await sut.findOne(1);

      expect(result).not.toBeUndefined();
      expect(result).toStrictEqual(football);
    });
  });

  describe('update', () => {
    it('returns null when class is not found', async () => {
      const result = await sut.update(1, { duration: 45 });

      expect(result).toBeNull();
    });

    it('returns updated class when found', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(football);
      const result = await sut.update(1, { duration: 123 });

      expect(result).not.toBeNull();
      expect(result).toEqual({ ...football, duration: 123 });
    });
  });

  describe('remove', () => {
    it('returns false when class is not found', async () => {
      const result = await sut.remove(1);

      expect(result).toEqual(false);
    });

    it('returns true when class is deleted', async () => {
      repository.delete = jest.fn().mockResolvedValueOnce({ affected: 1 });

      const result = await sut.remove(1);

      expect(result).toEqual(true);
    });
  });
});
