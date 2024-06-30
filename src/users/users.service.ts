import { Injectable } from '@nestjs/common';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '../auth/entities/tokens.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(email: string, password: string, tokens: Tokens) {
    const user = this.repository.create({ email, password, tokens });
    return user.save();
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email },
      relations: { tokens: true, classes: true },
    });
  }

  async findByToken(token: string) {
    return await this.repository.findOne({
      relations: {
        tokens: true,
        classes: true,
      },
      where: [
        {
          tokens: {
            accessToken: token,
          },
        },
        {
          tokens: {
            refreshToken: token,
          },
        },
      ],
    });
  }

  async update(id: number, updateUserDto: UpdateRolesDto) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    user.roles = updateUserDto.roles;

    return user.save();
  }

  async remove(id: number) {
    const result = await this.repository.delete(id);

    return result?.affected !== 0;
  }
}
