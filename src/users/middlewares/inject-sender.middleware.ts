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
    const splitHeader = req.headers.authorization?.split(' ');

    if (
      !splitHeader ||
      splitHeader.length !== 2 ||
      splitHeader.at(0) !== 'Bearer'
    ) {
      next();
      return;
    }

    const token = splitHeader[1];

    const validated = await this.jwtService.validate(token);
    if (!validated) {
      throw new UnauthorizedException();
    }

    req.user = await this.usersService.findByToken(token);

    next();
  }
}
