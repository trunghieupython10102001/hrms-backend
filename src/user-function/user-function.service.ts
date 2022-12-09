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

        const functions = await this.prisma.function.findMany();
        // const result = userFunction.map(async (item) => {
        //   const functionInfo = await this.prisma.function.findUnique({
        //     where: {
        //       id: item.functionID,
        //     },
        //   });
        //   return {
        //     ...item,
        //     functionInfo,
        //   };
        // });

        const idList = userFunction.map((item) => item.functionID);
        const result = userFunction.map((item) => {
          return item;
        });
        // return {
        //   userFunction,
        //   functions,
        // };
        return result;
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(
    functionId: number,
    updateUserFunctionDto: UpdateUserFunctionDto,
    req: Request,
  ) {
    try {
      const userFunction = await this.prisma.userFunction.update({
        where: {
          userID_functionID: {
            userID: updateUserFunctionDto.userId,
            functionID: updateUserFunctionDto.functionId,
          },
        },
        data: {
          isGrant: updateUserFunctionDto.isGrant,
          isDelete: updateUserFunctionDto.isDelete,
          isInsert: updateUserFunctionDto.isInsert,
          isUpdate: updateUserFunctionDto.isUpdate,
        },
      });
      return userFunction;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userFunction`;
  }
}
