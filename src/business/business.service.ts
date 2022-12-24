import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { GetBusinessDto } from './dto/get-business.dto';
import {
  Request,
  ConnectionPool,
  Int,
  NVarChar,
  SmallInt,
  VarChar,
  BigInt,
} from 'mssql';
import { checkRole, Operation } from 'src/common/checkRole';
import { FUNCTION_ID } from 'src/constants/role';

@Injectable()
export class BusinessService {
  constructor(private db: DbService) {}

  getConnection() {
    const sqlConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      server: 'localhost',
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
      },
    };
    const conn = new ConnectionPool(sqlConfig);
    return conn;
  }

  async findAll(query: GetBusinessDto, roles: any) {
    const isAllow = checkRole(roles, Operation.IS_GRANT, FUNCTION_ID.BUSINESS);

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const {
      businessId,
      businessEmail,
      businessName,
      businessPhone,
      businessType,
      status,
    } = query;
    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessID', Int, businessId);
    request.input('BusinessName', NVarChar(255), businessName);
    request.input('BusinessType', SmallInt, businessType);
    request.input('BusinessEmail', NVarChar(255), businessEmail);
    request.input('BusinessPhone', VarChar(20), businessPhone);
    request.input('Status', SmallInt, status);
    const result = await request.execute('SP_Business_GetList_CMS');
    return result.recordset;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  async createOrUpdate(dto: CreateBusinessDto, username: string, roles: any) {
    const isAllow = checkRole(roles, Operation.IS_INSERT, FUNCTION_ID.BUSINESS);

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const {
      businessId,
      businessAddress,
      businessAreaId,
      businessEmail,
      businessName,
      businessPhone,
      businessType,
      contactDetail,
      country,
      note,
      status,
    } = dto;

    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessID', Int, businessId);
    request.input('BusinessName', NVarChar(255), businessName);
    request.input('BusinessType', SmallInt, businessType);
    request.input('BusinessAreaID', Int, businessAreaId);
    request.input('BusinessAddress', NVarChar(1000), businessAddress);
    request.input('Country', NVarChar(100), country);
    request.input('ContactDetail', NVarChar(1000), contactDetail);
    request.input('Note', NVarChar, note);
    request.input('BusinessEmail', NVarChar(255), businessEmail);
    request.input('BusinessPhone', VarChar(20), businessPhone);
    request.input('Status', SmallInt, status);
    request.input('CreateUser', NVarChar(50), username);
    request.output('ResponseStatus', BigInt);
    try {
      const result = await request.execute('SP_Business_INUP_CMS');
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
}
