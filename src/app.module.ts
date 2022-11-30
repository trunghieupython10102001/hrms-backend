import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FunctionModule } from './function/function.module';
import { UserModule } from './user/user.module';
import { UserFunctionModule } from './user-function/user-function.module';
import { ImportExportModule } from './import-export/import-export.module';
import { BusinessModule } from './business/business.module';
import { DbModule } from './db/db.module';
import { BusinessAreaModule } from './business-area/business-area.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FunctionModule,
    UserModule,
    UserFunctionModule,
    ImportExportModule,
    BusinessModule,
    DbModule,
    BusinessAreaModule,
  ],
})
export class AppModule {}
