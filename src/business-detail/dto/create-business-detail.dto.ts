import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDetailDto {
  @IsNumber()
  businessDetailId: number;

  @IsNumber()
  businessId: number;

  @IsString()
  @IsOptional()
  importProductDetail?: string;

  @IsString()
  @IsOptional()
  exportProductDetail?: string;

  @IsString()
  @IsOptional()
  unitPrice?: string;

  @IsNumber()
  @IsOptional()
  status?: 0 | 1;
}
