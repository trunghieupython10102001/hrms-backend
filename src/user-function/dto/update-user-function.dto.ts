import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFunctionDto } from './create-user-function.dto';

export class UpdateUserFunctionDto extends PartialType(CreateUserFunctionDto) {}
