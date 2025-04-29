import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeTrackingsService } from './time-trackings.service';
import { CreateTimeTrackingDto } from './dto/create-time-tracking.dto';
import { UpdateTimeTrackingDto } from './dto/update-time-tracking.dto';

@Controller('time-trackings')
export class TimeTrackingsController {
  constructor(private readonly timeTrackingsService: TimeTrackingsService) {}

  @Post()
  create(@Body() createTimeTrackingDto: CreateTimeTrackingDto) {
    return this.timeTrackingsService.create(createTimeTrackingDto);
  }

  @Get()
  findAll() {
    return this.timeTrackingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeTrackingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeTrackingDto: UpdateTimeTrackingDto) {
    return this.timeTrackingsService.update(+id, updateTimeTrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeTrackingsService.remove(+id);
  }
}
