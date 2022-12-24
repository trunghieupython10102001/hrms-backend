import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  dateOfBirth: string;
}

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;
}
