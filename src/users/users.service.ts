import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(email: string, password: string): User {
    return this.repository.create({ email, password });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
