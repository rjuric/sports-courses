import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DayOfWeek } from '../../util/enums/day-of.week';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  constructor(
    sport: string,
    description: string,
    duration: number,
    schedule: CreateClassScheduleDto[],
  ) {
    this.sport = sport;
    this.description = description;
    this.duration = duration;
    this.schedule = schedule;
  }

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sport: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(80)
  description: string;

  @ApiProperty()
  @IsInt()
  @Min(45)
  @Max(180)
  duration: number;

  @ApiProperty({ type: CreateClassDto, isArray: true })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  schedule: CreateClassScheduleDto[];
}

export class CreateClassScheduleDto {
  constructor(day: DayOfWeek, time: string) {
    this.day = day;
    this.time = time;
  }

  @ApiProperty({ type: 'enum', enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @ApiProperty()
  @IsString()
  time: string;
}
