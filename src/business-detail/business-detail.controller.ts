import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BusinessDetailService } from './business-detail.service';
import { CreateBusinessDetailDto } from './dto/create-business-detail.dto';
import { GetBusinessDetailDto } from './dto/get-business-detail.dto';

@UseGuards(JwtGuard)
@Controller('business-detail')
export class BusinessDetailController {
  constructor(private readonly businessDetailService: BusinessDetailService) {}

  @Post()
  create(
    @Body() createBusinessDetailDto: CreateBusinessDetailDto,
    @Req() req: any,
  ) {
    return this.businessDetailService.createOrUpdate(
      createBusinessDetailDto,
      req?.user?.username,
    );
  }

  @Get()
  findAll(@Query() query: GetBusinessDetailDto) {
    return this.businessDetailService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessDetailService.findOne(+id);
  }
}
