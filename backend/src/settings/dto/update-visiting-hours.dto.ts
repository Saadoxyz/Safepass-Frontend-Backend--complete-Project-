// src/settings/dto/update-visiting-hours.dto.ts
import { IsString, IsArray, ArrayMinSize } from 'class-validator';

export class UpdateVisitingHoursDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsArray()
  @ArrayMinSize(1)
  days: string[];
}
