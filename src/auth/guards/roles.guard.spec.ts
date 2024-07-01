import { RolesGuard } from './roles.guard';
import { AuthenticatedRequest } from '../../util/interfaces/authenticated-request.interface';
import { User } from '../../users/entities/user.entity';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../../util/enums/role';

interface GuardContext {
  switchToHttp: () => {
    getRequest: () => AuthenticatedRequest;
  };
}

function getContext(user: User | null | undefined): GuardContext {
  return {
    switchToHttp: () => {
      return {
        getRequest: () => {
          return {
            user,
          } as AuthenticatedRequest;
        },
      };
    },
  };
}

describe('RolesGuard', () => {
  describe('no roles', () => {
    const guard = new RolesGuard([]);

    it('canActivate false when user is null', () => {
      const context = getContext(null);

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(false);
    });

    it('canActivate true when user is present', () => {
      const context = getContext(new User('test@tests.com', 'test', undefined));

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(true);
    });

    it('canActivate false when user is null', () => {
      const context = getContext(null);

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(false);
    });

    it('canActivate true when user is present with roles', () => {
      const context = getContext(
        new User('test@tests.com', 'test', undefined, [Role.USER]),
      );

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(true);
    });
  });

  describe('single role', () => {
    const guard = new RolesGuard([Role.ADMIN]);

    it('canActivate false when user is null', () => {
      const context = getContext(null);

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(false);
    });

    it('canActivate false when user does not have specified role', () => {
      const context = getContext(
        new User('test@tests.com', 'test', undefined, [Role.USER]),
      );

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(false);
    });

    it('canActivate true when and user has specified role', () => {
      const context = getContext(
        new User('test@tests.com', 'test', undefined, [Role.ADMIN]),
      );

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(true);
    });

    it('canActivate true when user has specified role and more', () => {
      const context = getContext(
        new User('test@tests.com', 'test', undefined, [Role.USER, Role.ADMIN]),
      );

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(true);
    });
  });

  describe('multiple roles', () => {
    const guard = new RolesGuard([Role.USER, Role.ADMIN]);

    it('canActivate false when user is null', () => {
      const context = getContext(null);

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(false);
    });

    it('canActivate true when user has one of the roles', () => {
      const context = getContext(
        new User('test@tests.com', 'test', undefined, [Role.USER]),
      );

      const result = guard.canActivate(context as ExecutionContext);

      expect(result).toStrictEqual(true);
    });
  });
});
