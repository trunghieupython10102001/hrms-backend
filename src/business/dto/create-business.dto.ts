import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsNumber()
  businessId: number;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsNumber()
  @IsOptional()
  businessType?: 1 | 2;

  @IsNumber()
  @IsOptional()
  businessAreaId?: number;

  @IsString()
  @IsOptional()
  businessAddress?: string;

  @IsEmail()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsOptional()
  businessPhone?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  contactDetail?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  status?: -1 | 0 | 1;
}
