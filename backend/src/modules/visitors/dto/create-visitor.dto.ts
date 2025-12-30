import { IsEmail, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateVisitorDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  cnic: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  purpose: string;

  @IsOptional()
  company?: string;

  @IsNotEmpty()
  hostId: string;

  @IsOptional()
  hostName?: string;

  @IsOptional()
  department?: string;

  @IsDateString()
  @IsNotEmpty()
  visitDate: string;

  @IsOptional()
  profileImage?: string;

  @IsOptional()
  notes?: string;
}
