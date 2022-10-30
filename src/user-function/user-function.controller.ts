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
  create(@Body() createUserFunctionDto: CreateUserFunctionDto) {
    return this.userFunctionService.create(createUserFunctionDto);
  }

  @Get()
  findAll() {
    return this.userFunctionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.userFunctionService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserFunctionDto: UpdateUserFunctionDto,
  ) {
    return this.userFunctionService.update(+id, updateUserFunctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFunctionService.remove(+id);
  }
}
