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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Class } from './entities/class.entity';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOkResponse({ type: Class, isArray: true })
  @Get()
  find(@Query() findAllClassesDto: FindAllClassesDto) {
    const sports = findAllClassesDto.sports?.toLowerCase().split(',');
    return this.classesService.find(sports);
  }

  @ApiOkResponse({ type: Class })
  @ApiNotFoundResponse({ description: 'No class found.' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.classesService.findOne(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Access token is invalid.' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'No class found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
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

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Access token is invalid.' })
  @ApiForbiddenResponse({ description: 'Sender is not ADMIN.' })
  @ApiCreatedResponse({ type: Class })
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Access token is invalid.' })
  @ApiForbiddenResponse({ description: 'Sender is not ADMIN.' })
  @ApiOkResponse({ type: Class })
  @ApiNotFoundResponse({ description: 'No class found.' })
  @ApiBody({ type: CreateClassDto })
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

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Access token is invalid.' })
  @ApiForbiddenResponse({ description: 'Sender is not ADMIN.' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'No class found.' })
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
