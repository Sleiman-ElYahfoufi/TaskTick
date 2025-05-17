import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { TimeTrackingsService } from './time-trackings.service';
import { CreateTimeTrackingDto } from './dto/create-time-tracking.dto';
import { UpdateTimeTrackingDto } from './dto/update-time-tracking.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('time-trackings')
@UseGuards(AuthGuard)
export class TimeTrackingsController {
  constructor(private readonly timeTrackingsService: TimeTrackingsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTimeTrackingDto: CreateTimeTrackingDto) {
    return this.timeTrackingsService.create(createTimeTrackingDto);
  }

  @Post('users/:userId/tasks/:taskId/start')
  @HttpCode(HttpStatus.CREATED)
  startUserTaskSession(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number
  ) {
    return this.timeTrackingsService.startUserTaskSession(userId, taskId);
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  endSession(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.endSession(id);
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  pauseSession(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.pauseUserSession(id);
  }

  @Post(':id/resume-paused')
  @HttpCode(HttpStatus.OK)
  resumeUserPausedSession(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.resumeUserPausedSession(id);
  }

  @Post(':id/resume-auto-paused')
  @HttpCode(HttpStatus.OK)
  resumeAutoPausedSession(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.resumeAutoPausedSession(id);
  }

  @Post(':id/heartbeat')
  @HttpCode(HttpStatus.OK)
  updateHeartbeat(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.updateHeartbeat(id);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('taskId') taskId?: string,
    @Query('autoPaused') autoPaused?: string
  ) {
    if (userId && autoPaused === 'true') {
      return this.timeTrackingsService.findAutoPausedSessionsByUserId(+userId);
    }

    if (userId) {
      return this.timeTrackingsService.findAllByUserId(+userId);
    }

    if (taskId) {
      return this.timeTrackingsService.findAllByTaskId(+taskId);
    }

    return this.timeTrackingsService.findAll();
  }

  @Get('users/:userId/active')
  findActiveSession(@Param('userId', ParseIntPipe) userId: number) {
    return this.timeTrackingsService.findActiveSessionByUserId(userId);
  }

  @Get('tasks/:taskId/summary')
  getTaskSummary(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.timeTrackingsService.getTaskTimeSummary(taskId);
  }

  @Get('users/:userId/productivity')
  getUserProductivity(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('days', ParseIntPipe) days?: number
  ) {
    return this.timeTrackingsService.getUserProductivity(
      userId,
      days || 7
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTimeTrackingDto: UpdateTimeTrackingDto
  ) {
    return this.timeTrackingsService.update(id, updateTimeTrackingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timeTrackingsService.remove(id);
  }
}