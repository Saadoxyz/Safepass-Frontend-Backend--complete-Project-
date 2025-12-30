import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  head?: string;

  @IsOptional()
  description?: string;
}
