import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBusinessDetailDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  businessDetailId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  businessId?: number;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  importProductDetail?: string;

  @IsString()
  @IsOptional()
  exportProductDetail?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  businessType?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  status?: number;
}
