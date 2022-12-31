import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto, UpdateUserDto } from './dto/auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Post('signup')
  signup(@Body() dto: SignupDto, @Req() req: any) {
    return this.authService.signup(dto, req?.user?.id, req?.user?.roles);
  }

  @UseGuards(JwtGuard)
  @Get('getMe')
  getMe(@Req() req: any) {
    return this.authService.findOne(+req.user.id, req);
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
  getAll(@Query() query, @Req() req: any) {
    return this.authService.getAllUser(query, req?.user?.roles);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.authService.findOne(+id, req);
  }

  @UseGuards(JwtGuard)
  @Patch('updatePassword')
  updatePassword(@Body() dto: UpdatePasswordDto, @Req() req: any) {
    return this.authService.updatePassword(+req?.user?.id, dto, req);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.authService.deleteUser(+id, req?.user?.roles);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.authService.updateUser(+id, dto, req);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatar')
  uploadImage(@UploadedFile() file: Express.Multer.File, @Body() dto: any) {
    return this.authService.uploadImage(file, dto);
  }
}
