import { Module } from '@nestjs/common';
import { ContactLogService } from './contact-log.service';
import { ContactLogController } from './contact-log.controller';

@Module({
  controllers: [ContactLogController],
  providers: [ContactLogService]
})
export class ContactLogModule {}
