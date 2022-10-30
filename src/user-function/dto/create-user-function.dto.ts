import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserFunctionDto {
  @IsBoolean()
  isGrant: boolean;

  @IsBoolean()
  isUpdate: boolean;

  @IsBoolean()
  isDelete: boolean;

  @IsBoolean()
  isInsert: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  functionId: number;
}
