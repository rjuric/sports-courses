import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Tokens } from '../auth/entities/tokens.entity';
import { Role } from '../util/enums/role';

const mockTokens = new Tokens(1, 'encrypted_token', 'encrypted_token');

describe('UsersService', () => {
  let sut: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest
              .fn()
              .mockImplementation(
                (email: string, password: string, tokens: Tokens) => {
                  return new User(email, password, tokens);
                },
              ),
            save: jest.fn().mockImplementation((entity: User) => {
              return entity;
            }),
            findOne: jest
              .fn()
              .mockImplementation(async (): Promise<User | null> => {
                return new User('test@test.com', 'test_hashed', mockTokens);
              }),
            delete: jest
              .fn()
              .mockImplementation(async (): Promise<DeleteResult> => {
                return { affected: 0 } as DeleteResult;
              }),
          },
        },
      ],
    }).compile();

    sut = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('creates a new user', async () => {
      const result = await sut.create(
        'test@test.com',
        'test_hashed',
        mockTokens,
      );

      expect(result).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('calls repository with email', async () => {
      await sut.findByEmail('test@test.com');

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: { classes: true, tokens: true },
        where: { email: 'test@test.com' },
      });
    });

    it('returns null when no user is found', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(null);

      const result = await sut.findByEmail('test@test.com');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: { classes: true, tokens: true },
        where: { email: 'test@test.com' },
      });
    });

    it('returns user when found', async () => {
      const result = await sut.findByEmail('test@test.com');

      expect(result).not.toBeNull();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: { classes: true, tokens: true },
        where: { email: 'test@test.com' },
      });
    });
  });

  describe('findByToken', () => {
    it('calls repository with token', async () => {
      await sut.findByToken('encrypted_token');

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: {
          tokens: true,
          classes: true,
        },
        where: [
          {
            tokens: {
              accessToken: 'encrypted_token',
            },
          },
          {
            tokens: {
              refreshToken: 'encrypted_token',
            },
          },
        ],
      });
    });

    it('returns null when no user is found', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(null);

      const result = await sut.findByToken('encrypted_token');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: {
          tokens: true,
          classes: true,
        },
        where: [
          {
            tokens: {
              accessToken: 'encrypted_token',
            },
          },
          {
            tokens: {
              refreshToken: 'encrypted_token',
            },
          },
        ],
      });
    });

    it('returns user when found', async () => {
      const result = await sut.findByToken('encrypted_token');

      expect(result).not.toBeNull();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: {
          tokens: true,
          classes: true,
        },
        where: [
          {
            tokens: {
              accessToken: 'encrypted_token',
            },
          },
          {
            tokens: {
              refreshToken: 'encrypted_token',
            },
          },
        ],
      });
    });
  });

  describe('update', () => {
    it('returns null when no user is found', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(null);

      const result = await sut.update(1, { roles: [Role.ADMIN] });

      expect(result).toBeNull();
    });

    it('updates roles on the user', async () => {
      const result = await sut.update(1, { roles: [Role.ADMIN] });

      expect(result).not.toBeNull();
      expect(result?.roles).toStrictEqual([Role.ADMIN]);
    });
  });

  describe('remove', () => {
    it('returns false when no user is found', async () => {
      const result = await sut.remove(1);

      expect(result).toStrictEqual(false);
    });

    it('returns true on success', async () => {
      repository.delete = jest
        .fn()
        .mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      const result = await sut.remove(1);

      expect(result).toStrictEqual(true);
    });
  });
});
