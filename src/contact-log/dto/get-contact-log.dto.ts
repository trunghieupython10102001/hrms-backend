import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetContactLogDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  logId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  businessId?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fromDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  toDate: Date;
}
