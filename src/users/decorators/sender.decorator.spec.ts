import { User } from '../entities/user.entity';
import { senderParamDecoratorFactory } from './sender.decorator';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

function getContext(user: User | null | undefined) {
  return {
    switchToHttp: () => {
      return {
        getRequest: () => {
          return { user };
        },
      };
    },
  } as ExecutionContext;
}

describe('Sender Decorator', () => {
  const sut = senderParamDecoratorFactory;

  describe('user not present', () => {
    const context = getContext(null);

    it('throws 401', () => {
      expect(async () => {
        sut(null, context);
      }).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('user present', () => {
    const user = new User('test@test.com', 'test', undefined);
    const context = getContext(user);

    it('returns user', () => {
      const result = sut(null, context);

      expect(result).toStrictEqual(user);
    });
  });
});
