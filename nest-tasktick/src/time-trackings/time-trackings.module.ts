import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeTrackingsService } from './time-trackings.service';
import { TimeTrackingsController } from './time-trackings.controller';
import { TimeTracking } from './entities/time-tracking.entity';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeTracking]),
    TasksModule,
    UsersModule,
    ScheduleModule.forRoot()
  ],
  controllers: [TimeTrackingsController],
  providers: [TimeTrackingsService],
  exports: [TimeTrackingsService]
})
export class TimeTrackingsModule {}