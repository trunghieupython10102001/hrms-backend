import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFunctionDto {
  @IsString()
  @IsNotEmpty()
  functionName: string;

  @IsString()
  @IsNotEmpty()
  functionLink: string;

  @IsBoolean()
  @IsOptional()
  isDisplay?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  parentID?: number;
}
