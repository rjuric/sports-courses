import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  async validate(token: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.configService.get<string>('jwt.secret')!,
        (err, decoded) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    });
  }

  async generate(data: object, expiresIn: string): Promise<string | undefined> {
    return await new Promise((resolve, reject) => {
      jwt.sign(
        data,
        this.configService.get<string>('jwt.secret')!,
        {
          expiresIn,
        },
        (err, token) => {
          if (err) {
            resolve(undefined);
          } else {
            resolve(token);
          }
        },
      );
    });
  }
}
