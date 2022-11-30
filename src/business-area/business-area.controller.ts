import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BusinessAreaService } from './business-area.service';
import { CreateBusinessAreaDto } from './dto/create-business-area.dto';
import { GetBusinessAreDto } from './dto/get-business-area.dto';

@UseGuards(JwtGuard)
@Controller('business-area')
export class BusinessAreaController {
  constructor(private readonly businessAreaService: BusinessAreaService) {}

  @Post()
  create(@Body() createBusinessAreaDto: CreateBusinessAreaDto) {
    return this.businessAreaService.createOrUpdate(createBusinessAreaDto);
  }

  @Get()
  findAll(@Query() query: GetBusinessAreDto) {
    return this.businessAreaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessAreaService.findOne(+id);
  }
}
