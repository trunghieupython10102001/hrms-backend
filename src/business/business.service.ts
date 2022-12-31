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
import { read, readFile, utils, writeFile, writeFileXLSX } from 'xlsx';
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
      businessAreaId,
    } = query;
    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessID', Int, businessId);
    request.input('BusinessAreaID', Int, businessAreaId);
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

  async getExcelTemplate(roles: any) {
    const isAllow = checkRole(roles, Operation.IS_GRANT, FUNCTION_ID.BUSINESS);

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const fileName = 'business.xlsx';
    return fileName;
  }

  async importExcel(file: Express.Multer.File, req: any, type: number) {
    const workbook = read(file.buffer);
    const sheetNames = workbook.SheetNames;
    let sheets = [];
    sheetNames.filter(
      (name) =>
        (sheets = utils.sheet_to_json(workbook.Sheets[name], {
          header: 1,
        })),
    );
    sheets.shift();

    const dtos: Array<CreateBusinessDto> = sheets.map((sheet) => {
      return {
        businessId: 0,
        businessName: sheet[0],
        businessType: type as 1 | 2,
        businessAreaId: sheet[1],
        businessAddress: sheet[2],
        businessEmail: sheet[3],
        businessPhone: '' + sheet[4],
        country: sheet[5],
        contactDeatail: sheet[6],
        note: sheet[7],
      };
    });

    try {
      const createRecords = async (dtos: Array<CreateBusinessDto>) => {
        dtos.map(async (dto) => {
          const res = await this.createOrUpdate(
            dto,
            req?.user?.username,
            req?.user?.roles,
          );
          console.log(res);
        });
      };
      await createRecords(dtos);
      return {
        status: HttpStatus.CREATED,
        message: 'Import Excel successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async exportExcel(query: any, req: any) {
    const isAllow = checkRole(
      req?.user?.roles,
      Operation.IS_GRANT,
      FUNCTION_ID.BUSINESS,
    );

    if (!isAllow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const conn = this.db.getConnection();
    const connection = await conn.connect();
    const request = new Request(connection);
    request.input('BusinessIDs', NVarChar(50), query.ids);
    const result = await request.execute('SP_Business_Export_CMS');
    console.log(result.recordsets);
    const workbook = utils.book_new();
    const data = result.recordsets[0].map((item) => {
      return [
        item.BusinessName,
        item.BusinessAreaID,
        item.BusinessAddress,
        item.BusinessEmail,
        item.BusinessPhone,
        item.Country,
        item.ContactDetail,
        item.Note,
      ];
    });

    const worksheet = utils.aoa_to_sheet([
      [
        'TÊN DOANH NGHIỆP',
        'LĨNH VỰC KINH DOANH',
        'ĐỊA CHỈ XUẤT/NHẬP KHẢU',
        'EMAIL',
        'ĐIỆN THOẠI',
        'QUỐC GIA',
        'CHI TIẾT LIÊN HỆ',
        'GHI CHÚ',
      ],
      ...data,
    ]);

    worksheet['!cols'] = [{ width: 10 }];

    utils.book_append_sheet(workbook, worksheet);
    const fileName = 'business-exported.xlsx';

    writeFileXLSX(workbook, `static/${fileName}`);
    return fileName;
  }
}
