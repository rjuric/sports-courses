import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyToClassDto {
  @ApiProperty()
  @IsBoolean()
  isApplied: boolean;
}
