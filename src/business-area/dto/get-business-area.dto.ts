import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBusinessAreDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  businessAreaId?: number;

  @IsString()
  @IsOptional()
  businessAreaName?: string;
}
