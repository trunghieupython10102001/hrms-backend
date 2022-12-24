import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
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
  create(
    @Body() createBusinessAreaDto: CreateBusinessAreaDto,
    @Req() req: any,
  ) {
    return this.businessAreaService.createOrUpdate(
      createBusinessAreaDto,
      req?.user?.roles,
    );
  }

  @Get()
  findAll(@Query() query: GetBusinessAreDto, @Req() req: any) {
    return this.businessAreaService.findAll(query, req?.user?.roles);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessAreaService.findOne(+id);
  }
}
