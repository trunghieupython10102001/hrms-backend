import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessAreaDto {
  @IsNumber()
  businessAreaId: number;

  @IsString()
  @IsOptional()
  businessAreaName?: string;

  @IsNumber()
  @IsOptional()
  status?: 0 | 1;
}
