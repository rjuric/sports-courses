import { IsOptional, IsString } from 'class-validator';

export class FindAllClassesDto {
  @IsString()
  @IsOptional()
  sports?: string;
}
