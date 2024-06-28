import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InjectUser implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization?.split(' ');

    if (!auth) {
      next();
      return;
    }

    const [_, token] = auth;
    const validated = await this.jwtService.validate(token);
    if (!validated) {
      throw new UnauthorizedException();
    }

    if (token) {
      req.body.user = await this.usersService.findByToken(token);
    }

    next();
  }
}
