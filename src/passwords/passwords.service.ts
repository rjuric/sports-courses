import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordsService {
  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }

  async hash(
    data: string,
    saltOrRounds: string | number = 10,
  ): Promise<string> {
    return await bcrypt.hash(data, saltOrRounds);
  }
}
