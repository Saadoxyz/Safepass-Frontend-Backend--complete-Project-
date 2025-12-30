import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  visitorId: string;

  @IsNotEmpty()
  reason: string;

  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsNotEmpty()
  incidentDate: string;
}
