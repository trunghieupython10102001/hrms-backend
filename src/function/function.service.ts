import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';

@Injectable()
export class FunctionService {
  constructor(private prisma: PrismaService) {}

  async create(createFunctionDto: CreateFunctionDto, userId: any) {
    const { functionName, isDisplay, isActive, parentID } = createFunctionDto;
    console.log(createFunctionDto);
    try {
      const functionInstantce = await this.prisma.function.create({
        data: {
          functionName,
          isDisplay,
          isActive,
          parentID,
          createdBy: userId?.id,
        },
      });

      console.log(functionInstantce);

      return {
        message: 'Function created successfully',
        function: functionInstantce,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all function`;
  }

  findOne(id: number) {
    return `This action returns a #${id} function`;
  }

  update(id: number, updateFunctionDto: UpdateFunctionDto) {
    return `This action updates a #${id} function`;
  }

  remove(id: number) {
    return `This action removes a #${id} function`;
  }
}
