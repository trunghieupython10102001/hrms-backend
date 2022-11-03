import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const password = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password,
          email: dto.email,
          fullname: dto.fullname,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: new Date(dto.dateOfBirth),
          avatarUrl: dto.avatarUrl,
          createdBy: +dto.createdBy,
        },
      });
      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists.');
        }
      }
      throw error;
    }
  }

  async getAllUser() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async signin(dto: SigninDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: dto.username,
        },
      });

      if (!user) {
        throw new ForbiddenException('Username or password is incorrect.');
      } else {
        if (await argon.verify(user.password, dto.password)) {
          delete user.password;
          return {
            user: {
              userId: user.id,
              username: user.username,
            },
            accessToken: await this.signToken(user.id, user.username),
          };
        } else {
          return {
            message: 'Username or password is incorrect',
            status: 401,
          };
        }
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async signToken(userId: number, username: string): Promise<string> {
    const payload = {
      sub: userId,
      username,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
