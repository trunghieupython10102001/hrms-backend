import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DateTime, Int, NVarChar, Request, SmallInt } from 'mssql';
import { checkRole, Operation } from 'src/common/checkRole';
import { FUNCTION_ID } from 'src/constants/role';
import { DbService } from 'src/db/db.service';
import { CreateContactLogDto } from './dto/create-contact-log.dto';
import { GetContactLogDto } from './dto/get-contact-log.dto';

@Injectable()
export class ContactLogService {
  constructor(private readonly db: DbService) {}

  async createOrUpdate(
    createContactLogDto: CreateContactLogDto,
    username: string,
    roles: any,
  ) {
    const isAllow = checkRole(
      roles,
      Operation.IS_INSERT,
      FUNCTION_ID.CONTACT_LOG,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { businessId, logId, content, note, status } = createContactLogDto;

    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('LogID', Int, logId);
    request.input('BusinessID', Int, businessId);
    request.input('Content', NVarChar, content);
    request.input('Note', NVarChar(100), note);
    request.input('Status', SmallInt, status);
    request.input('CreateUser', NVarChar(50), username);
    request.output('ResponseStatus', Int);

    try {
      const result = await request.execute('SP_ContactLog_INUP_CMS');
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

  async findAll(query: GetContactLogDto, roles: any) {
    const isAllow = checkRole(
      roles,
      Operation.IS_GRANT,
      FUNCTION_ID.CONTACT_LOG,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { businessId, logId, fromDate, toDate } = query;

    console.log('query', query);

    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('LogID', Int, logId);
    request.input('BusinessID', Int, businessId);
    request.input('FromDate', DateTime, fromDate);
    request.input('ToDate', DateTime, toDate);

    const result = await request.execute('SP_ContactLog_GetList_CMS');
    return result.recordsets;
  }

  findOne(id: number) {
    return `This action returns a #${id} contactLog`;
  }
}
