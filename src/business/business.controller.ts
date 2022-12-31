import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { query } from 'express';
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
      req?.user?.roles,
    );
  }

  @Get()
  findAll(@Query() query: GetBusinessDto, @Req() req: any) {
    return this.businessService.findAll(query, req?.user?.roles);
  }

  @Get('template')
  getExcel(@Req() req: any) {
    return this.businessService.getExcelTemplate(req?.user?.roles);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('excel/:type')
  importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Param('type') type: string,
  ) {
    return this.businessService.importExcel(file, req, +type);
  }

  @Get('excel')
  exportExcel(@Query() query: any, @Req() req: any) {
    return this.businessService.exportExcel(query, req);
  }
}
