import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ref, getDownloadURL, uploadBytes } from '@firebase/storage';
import { storage } from '../configs/firebase';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SigninDto, SignupDto, UpdateUserDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FUNCTION_ID } from 'src/constants/role';
import { checkRole, Operation } from 'src/common/checkRole';
import { uuidv4 } from '@firebase/util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto, createdBy: number, roles: any) {
    const password = await argon.hash(dto.password);

    const isAllow = checkRole(
      roles,
      Operation.IS_INSERT,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password,
          email: dto.email,
          fullname: dto.fullname,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: new Date(dto.dateOfBirth),
          avatarUrl: '',
          createdBy: +createdBy,
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

  async getAllUser(query: any, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_GRANT,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      const { keyword } = query;
      const users = await this.prisma.user.findMany({
        where: !keyword
          ? {
              isDeleted: false,
            }
          : {
              isDeleted: false,
              OR: [
                {
                  fullname: {
                    contains: keyword,
                  },
                },
                {
                  username: {
                    contains: keyword,
                  },
                },
                {
                  email: {
                    contains: keyword,
                  },
                },
                {
                  phoneNumber: {
                    contains: keyword,
                  },
                },
              ],
            },
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          phoneNumber: true,
          dateOfBirth: true,
          avatarUrl: true,
          createdAt: true,
          createdBy: true,
          upDatedAt: true,
        },
      });
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
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
        if (
          (await argon.verify(user.password, dto.password)) &&
          !user.isDeleted
        ) {
          delete user.password;
          return {
            user: {
              userId: user.id,
              username: user.username,
            },
            accessToken: await this.signToken(user.id, user.username),
            refreshToken: await this.signRefreshToken(user.id, user.username),
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
    const roles = await this.prisma.userFunction.findMany({
      where: {
        userID: userId,
      },
      include: {
        function: true,
      },
    });

    const payload = {
      sub: userId,
      username,
      roles,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async getNewToken(refreshToken: string) {
    if (!refreshToken)
      return {
        code: 401,
        message: 'Please login or register',
      };
    const payload = this.jwt.decode(refreshToken) as any;
    if (
      this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      })
    ) {
      return {
        accessToken: await this.signToken(payload?.sub, payload?.username),
        refreshToken: await this.signRefreshToken(
          payload?.sub,
          payload?.username,
        ),
      };
    }
    return {
      code: 403,
      message: 'Invalid refresh token',
    };
  }

  async signRefreshToken(userId: number, username: string): Promise<string> {
    const payload = {
      sub: userId,
      username,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '3d',
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_UPDATE,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (await argon.verify(user.password, dto.oldPassword)) {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: await argon.hash(dto.newPassword),
        },
      });
      return {
        status: 200,
        message: 'Update password successfully',
      };
    }

    return {
      status: 400,
      message: 'Wrong password',
    };
  }

  async findOne(id: number, req: any) {
    const isAllow = checkRole(
      req?.user?.roles,
      Operation.IS_GRANT,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    // console.log('isAllow', isAllow);

    if (req?.user?.id !== id) {
      if (!isAllow) {
        console.log('id', id);
        console.log('req', req?.user?.id);
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      const roles = await this.prisma.userFunction.findMany({
        where: {
          userID: id,
        },
        include: {
          function: true,
        },
      });
      return {
        user,
        roles,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(userId: number, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_DELETE,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isDeleted: true,
        },
      });

      return {
        status: 200,
        message: 'Delete user successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: number, dto: UpdateUserDto, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_UPDATE,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { dateOfBirth, email, fullname, password, phoneNumber } = dto;
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          dateOfBirth,
          email,
          fullname,
          password: password && (await argon.hash(password)),
          phoneNumber,
        },
      });
      delete user.password;
      return {
        user,
        message: 'Update user successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async uploadImage(file: Express.Multer.File, dto: any) {
    if (!file)
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);

    const storageRef = ref(storage, `/utico/${uuidv4()}${file.originalname}`);
    console.log(file.buffer);
    const uploadTask = uploadBytes(storageRef, file.buffer);
    const avatarUrl = await getDownloadURL((await uploadTask).ref);
    console.log(avatarUrl);
    await this.prisma.user.update({
      where: {
        id: +dto?.id,
      },
      data: {
        avatarUrl,
      },
    });
    return {
      status: 201,
      message: 'Upload avatar successfully',
    };
  }
}
