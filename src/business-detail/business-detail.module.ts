import { Module } from '@nestjs/common';
import { BusinessDetailService } from './business-detail.service';
import { BusinessDetailController } from './business-detail.controller';

@Module({
  controllers: [BusinessDetailController],
  providers: [BusinessDetailService],
})
export class BusinessDetailModule {}
