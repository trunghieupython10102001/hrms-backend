import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContactLogDto {
  @IsNumber()
  logId: number;

  @IsNumber()
  businessId: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  status?: 0 | 1;
}
