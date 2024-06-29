import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Any, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  create(createClassDto: CreateClassDto) {
    return this.classesRepository.save(createClassDto);
  }

  findAll(sports?: string[]) {
    if (!sports) {
      return this.classesRepository.find({ relations: { schedule: true } });
    }

    return this.classesRepository.find({
      relations: { schedule: true },
      where: { sport: In(sports) },
    });
  }

  async apply(id: number, user: User, isApplied: boolean) {
    if (!isApplied) {
      user.classes = user.classes.filter((c) => c.id !== id);
      await user.save();
      return;
    }

    const course = await this.classesRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ${id} not found`);
    }

    user.classes.push(course);
    await user.save();

    return;
  }

  async findOne(id: number) {
    const course = await this.classesRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!course) {
      throw new NotFoundException();
    }

    return course;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return this.classesRepository.save({
      id,
      ...updateClassDto,
    });
  }

  async remove(id: number) {
    const result = await this.classesRepository.delete({ id });

    if (result?.affected === 0) {
      throw new NotFoundException();
    }

    return;
  }
}
