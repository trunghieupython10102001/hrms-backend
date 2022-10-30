import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FunctionModule } from './function/function.module';
import { UserModule } from './user/user.module';
import { UserFunctionModule } from './user-function/user-function.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FunctionModule,
    UserModule,
    UserFunctionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
