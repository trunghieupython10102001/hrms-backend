import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto, @Req() req: Request) {
    return this.authService.signup(dto);
  }

  @UseGuards(JwtGuard)
  @Get('getMe')
  getMe(@Req() req: any) {
    return this.authService.findOne(+req.user.id);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('refreshToken')
  getNewToken(@Body() body: any) {
    return this.authService.getNewToken(body?.refreshToken);
  }

  @UseGuards(JwtGuard)
  @Get('getAll')
  getAll(@Query() query) {
    return this.authService.getAllUser(query);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }
}
