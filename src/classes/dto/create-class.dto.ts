import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DayOfWeek } from '../../util/day-of-week';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  sport: string;

  @IsInt()
  @Min(45)
  @Max(180)
  duration: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  schedule: CreateClassScheduleDto[];
}

export class CreateClassScheduleDto {
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @IsString()
  time: string;
}
