import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllClassesDto {
  @ApiProperty({ description: 'Comma delimited list of sports.' })
  @IsString()
  @IsOptional()
  sports?: string;
}
