import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(['admin', 'host', 'security'])
  @IsNotEmpty()
  role: string;

  @IsOptional()
  department?: string;

  @IsOptional()
  profileImage?: string;
}
