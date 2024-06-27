import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  create(createClassDto: CreateClassDto) {
    return 'This action adds a new class';
  }

  findAll(sports?: string[]) {
    console.log(sports);
    return `This action returns all classes`;
  }

  apply(id: number, isApplied: boolean) {
    return `This action applys a user to an #${id} class`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
