import { UsersService } from '../users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectSenderMiddleware } from './inject-sender.middleware';
import { JwtService } from '../../jwt/jwt.service';
import { AuthenticatedRequest } from '../../util/interfaces/authenticated-request.interface';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';

describe('InjectSenderMiddleware', () => {
  let sut: InjectSenderMiddleware;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InjectSenderMiddleware,
        {
          provide: UsersService,
          useValue: {
            findByToken: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: JwtService,
          useValue: {
            validate: async (data: string): Promise<boolean> => {
              return data === 'valid_token';
            },
          },
        },
      ],
    }).compile();

    sut = module.get<InjectSenderMiddleware>(InjectSenderMiddleware);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('inject', () => {
    it('returns and calls next once if no token present', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: undefined },
        user: null,
      } as AuthenticatedRequest;

      await sut.use(req, {} as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toBeNull();
    });

    it('returns and calls next once if header is single word', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: 'token' },
        user: null,
      } as AuthenticatedRequest;

      await sut.use(req, {} as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toBeNull();
    });

    it('returns and calls next once if header is more than 2 words', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: 'other token extra' },
        user: null,
      } as AuthenticatedRequest;

      await sut.use(req, {} as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toBeNull();
    });

    it('returns and calls next once if header is empty', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: '' },
        user: null,
      } as AuthenticatedRequest;

      await sut.use(req, {} as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toBeNull();
    });

    it('returns and calls next once if header does not start with Bearer', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: 'other token' },
        user: null,
      } as AuthenticatedRequest;

      await sut.use(req, {} as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toBeNull();
    });

    it('throws 401 if token is invalid', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: 'Bearer invalid_token' },
        user: null,
      } as AuthenticatedRequest;
      const spy = jest.spyOn(jwtService, 'validate');

      await expect(async () => {
        await sut.use(req, {} as Response, nextFunction);
      }).rejects.toThrow(UnauthorizedException);

      expect(spy).toHaveBeenCalledWith('invalid_token');
      expect(nextFunction).toHaveBeenCalledTimes(0);
      expect(req.user).toBeNull();
    });

    it('calls next function once if no user is found', async () => {
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: 'Bearer valid_token' },
        user: null,
      } as AuthenticatedRequest;
      const spy = jest.spyOn(jwtService, 'validate');

      await sut.use(req, {} as Response, nextFunction);

      expect(spy).toHaveBeenCalledWith('valid_token');
      expect(usersService.findByToken).toHaveBeenCalledWith('valid_token');
      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toBeNull();
    });

    it('calls next function once and injects user', async () => {
      const user = new User('test@test.com', 'password');
      usersService.findByToken = jest.fn().mockResolvedValueOnce(user);
      const nextFunction = jest.fn();
      const req = {
        headers: { authorization: 'Bearer valid_token' },
        user: null,
      } as AuthenticatedRequest;
      const spy = jest.spyOn(jwtService, 'validate');

      await sut.use(req, {} as Response, nextFunction);

      expect(spy).toHaveBeenCalledWith('valid_token');
      expect(usersService.findByToken).toHaveBeenCalledWith('valid_token');
      expect(nextFunction).toHaveBeenCalledTimes(1);
      expect(req.user).toStrictEqual(user);
    });
  });
});
