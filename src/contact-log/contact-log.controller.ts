import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ContactLogService } from './contact-log.service';
import { CreateContactLogDto } from './dto/create-contact-log.dto';
import { GetContactLogDto } from './dto/get-contact-log.dto';

@UseGuards(JwtGuard)
@Controller('contact-log')
export class ContactLogController {
  constructor(private readonly contactLogService: ContactLogService) {}

  @Post()
  create(@Body() createContactLogDto: CreateContactLogDto, @Req() req: any) {
    return this.contactLogService.createOrUpdate(
      createContactLogDto,
      req?.user?.username,
    );
  }

  @Get()
  findAll(@Query() query: GetContactLogDto) {
    return this.contactLogService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactLogService.findOne(+id);
  }
}
