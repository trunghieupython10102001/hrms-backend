import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserFunctionService } from './user-function.service';
import { CreateUserFunctionDto } from './dto/create-user-function.dto';
import { UpdateUserFunctionDto } from './dto/update-user-function.dto';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('user-function')
export class UserFunctionController {
  constructor(private readonly userFunctionService: UserFunctionService) {}

  @Post()
  create(
    @Body() createUserFunctionDto: CreateUserFunctionDto,
    @Req() req: any,
  ) {
    return this.userFunctionService.createOrUpdate(
      +req?.user?.id,
      createUserFunctionDto,
      req?.user?.roles,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.userFunctionService.findAll(req?.user?.roles);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.userFunctionService.findOne(+id, req, req?.user?.roles);
  }

  // @Patch(':id')
  // update(
  //   @Body() updateUserFunctionDto: UpdateUserFunctionDto,
  //   @Req() req: any,
  // ) {
  //   return this.userFunctionService.update(
  //     +req?.user?.id,
  //     updateUserFunctionDto,
  //   );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFunctionService.remove(+id);
  }
}
