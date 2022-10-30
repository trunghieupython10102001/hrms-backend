import { Module } from '@nestjs/common';
import { UserFunctionService } from './user-function.service';
import { UserFunctionController } from './user-function.controller';

@Module({
  controllers: [UserFunctionController],
  providers: [UserFunctionService]
})
export class UserFunctionModule {}
