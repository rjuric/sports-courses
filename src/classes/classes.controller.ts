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
  NotFoundException,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FindAllClassesDto } from './dto/find-all-classes.dto';
import { ApplyToClassDto } from './dto/apply-to-class.dto';
import { User } from '../users/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../util/enums/role';
import { Sender } from '../users/decorators/sender.decorator';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  find(@Query() findAllClassesDto: FindAllClassesDto) {
    const sports = findAllClassesDto.sports?.split(',');
    return this.classesService.find(sports);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const result = this.classesService.findOne(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Post(':id/apply')
  async apply(
    @Param('id', ParseIntPipe) id: number,
    @Sender() user: User,
    @Body() applyClassDto: ApplyToClassDto,
  ) {
    const result = await this.classesService.apply(
      id,
      user,
      applyClassDto.isApplied,
    );

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const result = await this.classesService.update(id, updateClassDto);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.classesService.remove(id);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }
}
