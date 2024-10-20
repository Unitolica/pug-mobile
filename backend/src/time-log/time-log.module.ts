import { Module } from '@nestjs/common';
import { TimeLogService } from './time-log.service';
import { TimeLogController } from './time-log.controller';

@Module({
  controllers: [TimeLogController],
  providers: [TimeLogService],
})
export class TimeLogModule {}
