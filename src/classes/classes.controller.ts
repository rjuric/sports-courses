import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FindAllClassesDto } from './dto/find-all-classes.dto';
import { ApplyToClassDto } from './dto/apply-to-class.dto';
import { Sender } from '../util/decorators/sender.decorator';
import { User } from '../users/entities/user.entity';
import { Admin } from '../util/decorators/admin.decorator';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll(@Query() findAllClassesDto: FindAllClassesDto) {
    const sports = findAllClassesDto.sports?.split(',');
    return this.classesService.findAll(sports);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Post(':id/apply')
  apply(
    @Param('id', ParseIntPipe) id: number,
    @Sender() user: User,
    @Body() applyClassDto: ApplyToClassDto,
  ) {
    return this.classesService.apply(id, user, applyClassDto.isApplied);
  }

  @Post()
  create(@Body() createClassDto: CreateClassDto, @Admin() _: User) {
    return this.classesService.create(createClassDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Admin() _: User,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(id, updateClassDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Admin() _: User) {
    await this.classesService.remove(id);
  }
}
