import { IsBoolean } from 'class-validator';

export class ApplyToClassDto {
  @IsBoolean()
  isApplied: boolean;
}
