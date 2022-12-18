import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FunctionModule } from './function/function.module';
import { UserFunctionModule } from './user-function/user-function.module';
import { BusinessModule } from './business/business.module';
import { DbModule } from './db/db.module';
import { BusinessAreaModule } from './business-area/business-area.module';
import { BusinessDetailModule } from './business-detail/business-detail.module';
import { ContactLogModule } from './contact-log/contact-log.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FunctionModule,
    UserFunctionModule,
    BusinessModule,
    DbModule,
    BusinessAreaModule,
    BusinessDetailModule,
    ContactLogModule,
  ],
})
export class AppModule {}
