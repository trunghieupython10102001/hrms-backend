import { Module } from '@nestjs/common';
import { BusinessAreaService } from './business-area.service';
import { BusinessAreaController } from './business-area.controller';

@Module({
  controllers: [BusinessAreaController],
  providers: [BusinessAreaService],
})
export class BusinessAreaModule {}
