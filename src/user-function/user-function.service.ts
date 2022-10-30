import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserFunctionDto } from './dto/create-user-function.dto';
import { UpdateUserFunctionDto } from './dto/update-user-function.dto';
import { Request } from 'express';

@Injectable()
export class UserFunctionService {
  constructor(private prisma: PrismaService) {}

  create(createUserFunctionDto: CreateUserFunctionDto) {
    return 'This action adds a new userFunction';
  }

  async findAll() {
    try {
      const allUserFunction = await this.prisma.userFunction.findMany();
      return allUserFunction;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number, req: any) {
    try {
      if (id === req.user?.id) {
        const userFunction = await this.prisma.userFunction.findMany({
          where: { userID: id },
        });
        return userFunction;
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  update(id: number, updateUserFunctionDto: UpdateUserFunctionDto) {
    return `This action updates a #${id} userFunction`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFunction`;
  }
}
