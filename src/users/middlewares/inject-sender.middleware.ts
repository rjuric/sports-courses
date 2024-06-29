import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from '../users.service';
import { JwtService } from '../../jwt/jwt.service';
import { AuthenticatedRequest } from '../../util/interfaces/authenticated-request.interface';

@Injectable()
export class InjectSenderMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ').at(1);

    if (!token) {
      next();
      return;
    }

    const validated = await this.jwtService.validate(token);
    if (!validated) {
      throw new UnauthorizedException();
    }

    if (token) {
      req.user = await this.usersService.findByToken(token);
    }

    next();
  }
}
