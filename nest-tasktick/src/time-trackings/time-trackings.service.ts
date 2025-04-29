import { Injectable } from '@nestjs/common';
import { CreateTimeTrackingDto } from './dto/create-time-tracking.dto';
import { UpdateTimeTrackingDto } from './dto/update-time-tracking.dto';

@Injectable()
export class TimeTrackingsService {
  create(createTimeTrackingDto: CreateTimeTrackingDto) {
    return 'This action adds a new timeTracking';
  }

  findAll() {
    return `This action returns all timeTrackings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeTracking`;
  }

  update(id: number, updateTimeTrackingDto: UpdateTimeTrackingDto) {
    return `This action updates a #${id} timeTracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeTracking`;
  }
}
