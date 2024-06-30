import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';
import { Repository } from 'typeorm';
import { Tokens } from './entities/tokens.entity';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { PasswordsService } from '../passwords/passwords.service';

const moduleMocker = new ModuleMocker(global);

const mockTokens = new Tokens(1, 'encrypted_token', 'encrypted_token');

describe('AuthService', () => {
  let sut: AuthService;
  let usersService: UsersService;
  let passwordsService: PasswordsService;
  let jwtService: JwtService;
  let tokensRepository: Repository<Tokens>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Tokens),
          useValue: {
            create: jest
              .fn()
              .mockImplementation(
                (data: { accessToken: string; refreshToken: string }) => {
                  return { id: 1, ...data } as Tokens;
                },
              ),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    sut = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    passwordsService = module.get<PasswordsService>(PasswordsService);
    jwtService = module.get<JwtService>(JwtService);
    tokensRepository = module.get<Repository<Tokens>>(
      getRepositoryToken(Tokens),
    );

    jwtService.generate = jest.fn().mockImplementation(async () => {
      return 'encrypted_token';
    });

    passwordsService.hash = jest
      .fn()
      .mockImplementation(async (password: string) => {
        return password + '_hashed';
      });
    passwordsService.compare = jest
      .fn()
      .mockImplementation(async (data: string, encrypted: string) => {
        return data + '_hashed' === encrypted;
      });
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('signUp', () => {
    it('returns null if user already exists', async () => {
      usersService.findByEmail = jest
        .fn()
        .mockResolvedValueOnce({ email: 'email@email.com' } as User);

      const result = await sut.signUp({
        email: 'test@test.com',
        password: 'test',
      });

      expect(result).toBeNull();
    });

    it('returns user with tokens and hashed password', async () => {
      usersService.findByEmail = jest.fn().mockResolvedValueOnce(null);
      usersService.create = jest
        .fn()
        .mockImplementationOnce(
          (email: string, password: string, tokens: Tokens) => {
            return new User(email, password, tokens);
          },
        );

      const result = await sut.signUp({
        email: 'test@test.com',
        password: 'test',
      });

      expect(result).not.toBeNull();
      expect(result?.password).toBeDefined();
      expect(result?.password).not.toEqual('test');
      expect(result?.tokens).toBeDefined();
      expect(result?.tokens).toEqual(mockTokens);
    });
  });

  describe('signIn', () => {
    it('returns null if email not found', async () => {
      usersService.findByEmail = jest.fn().mockResolvedValue(null);

      const result = await sut.signIn({
        email: 'test@test.com',
        password: 'test',
      });

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('returns null if passwords dont match', async () => {
      const mockUser = new User(
        'test@test.com',
        'test_hashed',
        mockTokens as Tokens,
      );

      usersService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);

      const result = await sut.signIn({
        email: 'test@test.com',
        password: 'test1',
      });

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
      expect(passwordsService.compare).toHaveBeenCalledTimes(1);
    });

    it('returns user', async () => {
      const mockUser = new User(
        'test@test.com',
        'test_hashed',
        mockTokens as Tokens,
      );
      mockUser.save = jest.fn().mockImplementationOnce(() => {
        return mockUser;
      });

      tokensRepository.create = jest.fn().mockImplementationOnce(() => {});
      usersService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);

      const result = await sut.signIn({
        email: 'test@test.com',
        password: 'test',
      });

      expect(result).toBeDefined();
    });
  });

  describe('signOut', () => {
    it('returns user without tokens', async () => {
      const mockUser = new User('test@test.com', 'test_hashed', mockTokens);
      mockTokens.remove = jest.fn().mockImplementationOnce(() => {
        mockUser.tokens = undefined;
      });

      const result = await sut.signOut(mockUser);

      expect(result).toBeUndefined();
      expect(mockUser.tokens).toBeUndefined();
    });
  });

  describe('refresh', () => {
    it('returns user with tokens', async () => {
      const mockedUser = new User('test@test.com', 'test_hashed', mockTokens);
      mockedUser.save = jest.fn().mockImplementationOnce(() => mockedUser);

      const result = await sut.refresh(mockedUser);

      expect(result).toBeDefined();
    });
  });
});
