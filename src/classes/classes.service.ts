import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  create(createClassDto: CreateClassDto): Promise<Class> {
    const theClass = this.classesRepository.create({
      ...createClassDto,
      sport: createClassDto.sport.toLowerCase(),
    });
    return this.classesRepository.save(theClass);
  }

  find(sports?: string[]): Promise<Class[]> {
    if (!sports || sports.length === 0) {
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
      return await user.save();
    }

    const course = await this.classesRepository.findOne({
      where: { id },
    });

    if (!course) {
      return null;
    }

    user.classes.push(course);
    return await user.save();
  }

  findOne(id: number): Promise<Class | null> {
    return this.classesRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const theClass = await this.classesRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!theClass) {
      return null;
    }

    Object.assign(theClass, updateClassDto);
    return this.classesRepository.save(theClass);
  }

  async remove(id: number) {
    const result = await this.classesRepository.delete({ id });

    return result?.affected !== 0;
  }
}
