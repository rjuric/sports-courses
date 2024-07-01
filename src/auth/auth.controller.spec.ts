import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestBed } from '@automock/jest';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { SignInDto } from '../users/dto/sign-in.dto';
import { Tokens } from './entities/tokens.entity';

describe('AuthController', () => {
  let sut: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();
    sut = unit;
    service = unitRef.get(AuthService);
  });

  it('signUp throws 400 on service returning null', async () => {
    service.signUp.mockResolvedValue(null);

    await expect(async () => await sut.signUp({} as SignUpDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signUp returns user', async () => {
    const mockedUser = {
      email: 'test@test.com',
      password: '12AAAAAAAAAA',
    } as User;
    service.signUp.mockResolvedValue(mockedUser);
    const dto = new SignUpDto();
    Object.assign(dto, mockedUser);

    const result = await sut.signUp(dto);

    expect(result).toEqual(mockedUser);
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signIn throws 400 on falsy return', async () => {
    service.signIn.mockResolvedValue(null);

    await expect(async () => {
      await sut.signIn({} as SignInDto);
    }).rejects.toThrow(BadRequestException);

    expect(service.signIn).toHaveBeenCalled();

    service.signIn.mockResolvedValue(null);

    await expect(async () => {
      await sut.signIn({} as SignInDto);
    }).rejects.toThrow(BadRequestException);

    expect(service.signIn).toHaveBeenCalledTimes(2);
  });

  it('signIn returns user', async () => {
    const tokens = {
      accessToken: 'a',
      refreshToken: 'r',
    } as Tokens;

    const mockedUser = new User('test@test.com', 'test_hashed', tokens);

    service.signIn.mockResolvedValue(mockedUser);
    const dto = { email: 'email@test.com', password: 'any' };

    const result = await sut.signIn(dto);

    expect(result).toEqual(mockedUser);
    expect(service.signIn).toHaveBeenCalled();
  });

  it('service.signOut gets called', async () => {
    await sut.signOut({} as User);

    expect(service.signOut).toHaveBeenCalled();
  });

  it('service.refresh gets called', async () => {
    await sut.refresh({} as User);

    expect(service.refresh).toHaveBeenCalled();
  });
});
