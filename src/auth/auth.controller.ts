import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto, @Req() req: Request) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('refreshToken')
  getNewToken(@Body() body: any) {
    return this.authService.getNewToken(body?.refreshToken);
  }

  @Get('getAll')
  getAll() {
    return this.authService.getAllUser();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Get('getMe')
  getMe(@Req() req: any) {
    return this.authService.findOne(req.user.id);
  }
}
