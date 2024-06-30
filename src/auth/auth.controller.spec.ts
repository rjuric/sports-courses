import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestBed } from '@automock/jest';
import { SignUpDto } from '../users/dto/sign-up.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { SignInDto } from '../users/dto/sign-in.dto';
import { Tokens } from './entities/tokens.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();
    controller = unit;
    service = unitRef.get(AuthService);
  });

  it('signUp throws 400 on service returning null', async () => {
    service.signUp.mockResolvedValue(null);

    await expect(
      async () => await controller.signUp({} as SignUpDto),
    ).rejects.toThrow(BadRequestException);
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signUp throws 400 on invalid email in DTO', async () => {
    const dto = new SignUpDto();
    dto.email = 'not.an.email';
    dto.password = '12AAAAAAAAAA';

    await expect(async () => await controller.signUp(dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signUp throws 400 on invalid password in DTO', async () => {
    const dto = new SignUpDto();
    dto.email = 'test@test.com';
    dto.password = '11AAAAAAAAA';

    await expect(async () => await controller.signUp(dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signUp throws 400 on invalid DTO', async () => {
    const dto = new SignUpDto();
    dto.email = 'test.test.com';
    dto.password = '11AAAAAAAAA';

    await expect(async () => await controller.signUp(dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signUp returns user on correct DTO', async () => {
    const mockedUser = {
      email: 'test@test.com',
      password: '12AAAAAAAAAA',
    } as User;
    service.signUp.mockResolvedValue(mockedUser);
    const dto = new SignUpDto();
    Object.assign(dto, mockedUser);

    const result = await controller.signUp(dto);

    expect(result).toEqual(mockedUser);
    expect(service.signUp).toHaveBeenCalled();
  });

  it('signIn throws 400 on falsy return', async () => {
    service.signIn.mockResolvedValue(null);

    await expect(async () => {
      await controller.signIn({} as SignInDto);
    }).rejects.toThrow(BadRequestException);

    expect(service.signIn).toHaveBeenCalled();

    service.signIn.mockResolvedValue(undefined);

    await expect(async () => {
      await controller.signIn({} as SignInDto);
    }).rejects.toThrow(BadRequestException);

    expect(service.signIn).toHaveBeenCalledTimes(2);
  });

  it('signIn throws 400 on invalid email in DTO', async () => {
    const dto = new SignInDto();
    dto.email = 'not.an.email';
    dto.password = '12AAAAAAAAAA';

    await expect(async () => await controller.signIn(dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.signIn).toHaveBeenCalled();
  });

  it('signIn returns tokens on correct DTO', async () => {
    const tokens = {
      accessToken: 'a',
      refreshToken: 'r',
    } as Tokens;
    service.signIn.mockResolvedValue(tokens);
    const dto = { email: 'email@test.com', password: 'any' };

    const result = await controller.signIn(dto);

    expect(result).toEqual(tokens);
    expect(service.signIn).toHaveBeenCalled();
  });

  it('service.signOut gets called', async () => {
    await controller.signOut({} as User);

    expect(service.signOut).toHaveBeenCalled();
  });

  it('service.refresh gets called', async () => {
    await controller.refresh({} as User);

    expect(service.refresh).toHaveBeenCalled();
  });
});
