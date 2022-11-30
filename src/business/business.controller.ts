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
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { GetBusinessDto } from './dto/get-business.dto';

@UseGuards(JwtGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto, @Req() req: any) {
    console.log(req.user?.username);
    return this.businessService.createOrUpdate(
      createBusinessDto,
      req.user?.username,
    );
  }

  @Get()
  findAll(@Query() query: GetBusinessDto) {
    return this.businessService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(+id);
  }
}
