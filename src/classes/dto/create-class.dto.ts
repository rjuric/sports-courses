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
import { DayOfWeekEnum } from '../../util/enums/day-of-week.enum';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  sport: string;

  @IsString()
  @MinLength(20)
  @MaxLength(80)
  description: string;

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
  @IsEnum(DayOfWeekEnum)
  day: DayOfWeekEnum;

  @IsString()
  time: string;
}
