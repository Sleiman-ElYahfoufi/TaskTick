import { Module } from '@nestjs/common';
import { TimeTrackingsService } from './time-trackings.service';
import { TimeTrackingsController } from './time-trackings.controller';

@Module({
  controllers: [TimeTrackingsController],
  providers: [TimeTrackingsService],
})
export class TimeTrackingsModule {}
