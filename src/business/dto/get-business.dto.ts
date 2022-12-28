import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBusinessDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  businessId?: number;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  businessType?: 0 | 1 | 2;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  businessAreaId?: number;

  @IsEmail()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsOptional()
  businessPhone?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  status?: -1 | 0 | 1;
}
