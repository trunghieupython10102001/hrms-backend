import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Int, NVarChar, Request, SmallInt } from 'mssql';
import { checkRole, Operation } from 'src/common/checkRole';
import { FUNCTION_ID } from 'src/constants/role';
import { DbService } from 'src/db/db.service';
import { CreateBusinessAreaDto } from './dto/create-business-area.dto';
import { GetBusinessAreDto } from './dto/get-business-area.dto';

@Injectable()
export class BusinessAreaService {
  constructor(private readonly db: DbService) {}

  async createOrUpdate(
    createBusinessAreaDto: CreateBusinessAreaDto,
    roles: any,
  ) {
    const isAllow = checkRole(
      roles,
      Operation.IS_INSERT,
      FUNCTION_ID.BUSINESS_AREA,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { businessAreaId, businessAreaName, status } = createBusinessAreaDto;

    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessAreaID', Int, businessAreaId);
    request.input('BusinessAreaName', NVarChar(255), businessAreaName);
    request.input('Status', SmallInt, status);
    request.output('ResponseStatus', Int);

    try {
      const result = await request.execute('SP_BusinessArea_INUP_CMS');
      if (result.output.ResponseStatus > 0) {
        return {
          message: 'Successfully',
          code: result.output.ResponseStatus,
        };
      } else {
        return {
          message: 'Something went wrong',
          errorCode: result.output.ResponseStatus,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: GetBusinessAreDto, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_GRANT,
      FUNCTION_ID.BUSINESS_AREA,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { businessAreaId, businessAreaName } = query;
    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessAreaID', Int, businessAreaId);
    request.input('BusinessAreaName', NVarChar(255), businessAreaName);
    const result = await request.execute('SP_BusinessArea_GetList_CMS');
    return result.recordset;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessArea`;
  }
}
