import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetContactLogDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  logId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  businessId?: number;
}
