import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class UpdateVisitorDto {
  @IsEnum(['pending', 'approved', 'rejected', 'checked-in', 'checked-out'])
  @IsOptional()
  status?: string;

  @IsOptional()
  gatePassNumber?: string;

  @IsOptional()
  qrCode?: string;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;

  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @IsOptional()
  notes?: string;
}
