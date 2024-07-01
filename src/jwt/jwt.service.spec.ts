import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtService', () => {
  let sut: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.secret') {
                return 'secret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    sut = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('generate', () => {
    it('generates a token', async () => {
      const result = await sut.generate({ test: 'data' }, '1h');

      expect(result).toBeDefined();
    });

    it('generates a token that is valid', async () => {
      const result = await sut.generate({ test: 'data' }, '1h');

      const isValid = await sut.validate(result!);

      expect(result).toBeDefined();
      expect(isValid).toStrictEqual(true);
    });
  });

  describe('validate', () => {
    it('returns true if token is', async () => {
      const token = await sut.generate({ test: 'data' }, '1h');

      const isValid = await sut.validate(token!);

      expect(token).toBeDefined();
      expect(isValid).toStrictEqual(true);
    });

    it('returns false if token is not valid', async () => {
      const isValid = await sut.validate('a_random_token');

      expect(isValid).toStrictEqual(false);
    });

    it('returns false if token is expired', async () => {
      const hourInMs = 60 * 60 * 1000;
      const token = await sut.generate({ test: 'data' }, '1h');
      jest.useFakeTimers();

      jest.advanceTimersByTime(hourInMs + 500);
      const isValid = await sut.validate(token!);

      expect(token).toBeDefined();
      expect(isValid).toStrictEqual(false);
      jest.useRealTimers();
    });
  });
});
