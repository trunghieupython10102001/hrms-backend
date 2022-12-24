import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserFunctionDto } from './dto/create-user-function.dto';
import { UpdateUserFunctionDto } from './dto/update-user-function.dto';
import { Request } from 'express';
import { checkRole, Operation } from 'src/common/checkRole';
import { FUNCTION_ID } from 'src/constants/role';

@Injectable()
export class UserFunctionService {
  constructor(private prisma: PrismaService) {}

  async create(createUserFunctionDto: CreateUserFunctionDto) {
    try {
    } catch (error) {}
  }

  async findAll(roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_GRANT,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      const allUserFunction = await this.prisma.userFunction.findMany();
      return allUserFunction;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number, req: any, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_GRANT,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
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

  async createOrUpdate(
    createdBy: number,
    updateUserFunctionDto: UpdateUserFunctionDto,
    roles: any,
  ) {
    const isAllow = checkRole(
      roles,
      Operation.IS_INSERT,
      FUNCTION_ID.USER_MANAGEMENT,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    try {
      const userFunction = await this.prisma.userFunction.upsert({
        create: {
          functionID: updateUserFunctionDto.functionId,
          userID: updateUserFunctionDto.userId,
          isDelete: updateUserFunctionDto.isDelete,
          isGrant: updateUserFunctionDto.isGrant,
          isInsert: updateUserFunctionDto.isInsert,
          isUpdate: updateUserFunctionDto.isUpdate,
          createdBy,
        },
        update: {
          isDelete: updateUserFunctionDto.isDelete,
          isGrant: updateUserFunctionDto.isGrant,
          isInsert: updateUserFunctionDto.isInsert,
          isUpdate: updateUserFunctionDto.isUpdate,
          createdBy,
        },
        where: {
          userID_functionID: {
            functionID: updateUserFunctionDto.functionId,
            userID: updateUserFunctionDto.userId,
          },
        },
      });
      return userFunction;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userFunction`;
  }
}
