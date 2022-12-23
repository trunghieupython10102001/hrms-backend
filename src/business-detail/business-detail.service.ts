import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Int, NVarChar, Request, SmallInt } from 'mssql';
import { DbService } from 'src/db/db.service';
import { CreateBusinessDetailDto } from './dto/create-business-detail.dto';
import { GetBusinessDetailDto } from './dto/get-business-detail.dto';

@Injectable()
export class BusinessDetailService {
  constructor(private readonly db: DbService) {}

  async createOrUpdate(dto: CreateBusinessDetailDto, username: string) {
    const {
      businessDetailId,
      businessId,
      exportProductDetail,
      importProductDetail,
      status,
      unitPrice,
    } = dto;
    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessDetailID', Int, businessDetailId);
    request.input('BusinessID', Int, businessId);
    request.input('ImportProductDetail', NVarChar, importProductDetail);
    request.input('ExportProductDetail', NVarChar, exportProductDetail);
    request.input('UnitPrice', NVarChar(500), unitPrice);
    request.input('Status', SmallInt, status);
    request.input('CreateUser', NVarChar(50), username);
    request.output('ResponseStatus', Int);

    try {
      const result = await request.execute('SP_BusinessDetail_INUP_CMS');
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

  async findAll(query: GetBusinessDetailDto) {
    const {
      businessDetailId,
      businessId,
      businessName,
      businessType,
      status,
      exportProductDetail,
      importProductDetail,
    } = query;

    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);

    request.input('BusinessDetailID', Int, businessDetailId);
    request.input('BusinessID', Int, businessId);
    request.input('BusinessName', NVarChar(255), businessName);
    request.input('ImportProductDetail', NVarChar, importProductDetail);
    request.input('ExportProductDetail', NVarChar, exportProductDetail);
    request.input('BusinessType', SmallInt, businessType);
    request.input('Status', SmallInt, status);

    const result = await request.execute('SP_BusinessDetail_GetList_CMS');
    return result.recordsets;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessDetail`;
  }
}
