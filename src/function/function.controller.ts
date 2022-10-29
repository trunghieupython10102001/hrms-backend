import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FunctionService } from './function.service';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('function')
export class FunctionController {
  constructor(private readonly functionService: FunctionService) {}

  @Post()
  create(@Body() createFunctionDto: CreateFunctionDto, @Req() req: Request) {
    return this.functionService.create(createFunctionDto, req.user);
  }

  @Get()
  findAll() {
    return this.functionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.functionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFunctionDto: UpdateFunctionDto,
  ) {
    return this.functionService.update(+id, updateFunctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionService.remove(+id);
  }
}
