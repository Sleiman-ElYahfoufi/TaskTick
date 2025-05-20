import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, Not } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { CreateTimeTrackingDto } from './dto/create-time-tracking.dto';
import { UpdateTimeTrackingDto } from './dto/update-time-tracking.dto';
import { TimeTracking } from './entities/time-tracking.entity';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TimeTrackingsService {
  constructor(
    @InjectRepository(TimeTracking)
    private timeTrackingRepository: Repository<TimeTracking>,
    private usersService: UsersService,
    private tasksService: TasksService,
  ) { }

  async create(createTimeTrackingDto: CreateTimeTrackingDto): Promise<TimeTracking> {

    await this.usersService.findOne(createTimeTrackingDto.user_id);
    await this.tasksService.findOne(createTimeTrackingDto.task_id);


    if (createTimeTrackingDto.end_time && !createTimeTrackingDto.duration_hours && createTimeTrackingDto.start_time) {
      const startTime = new Date(createTimeTrackingDto.start_time);
      const endTime = new Date(createTimeTrackingDto.end_time);


      const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      createTimeTrackingDto.duration_hours = parseFloat(durationInHours.toFixed(2));
    }


    if (createTimeTrackingDto.is_active) {
      await this.endActiveSessionsForUser(createTimeTrackingDto.user_id);
    }


    if (createTimeTrackingDto.is_active) {
      createTimeTrackingDto['last_heartbeat'] = new Date();
    }

    const timeTracking = this.timeTrackingRepository.create(createTimeTrackingDto);
    return this.timeTrackingRepository.save(timeTracking);
  }

  async startUserTaskSession(userId: number, taskId: number): Promise<TimeTracking> {

    await this.endActiveSessionsForUser(userId);


    await this.usersService.findOne(userId);
    await this.tasksService.findOne(taskId);


    const now = new Date();
    const createDto: CreateTimeTrackingDto = {
      user_id: userId,
      task_id: taskId,
      date: new Date(now.toISOString().split('T')[0]),
      is_active: true
    };

    return this.create(createDto);
  }

  async pauseUserSession(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);

    if (!session.is_active) {
      throw new BadRequestException('Cannot pause an inactive session');
    }

    if (session.is_paused) {
      throw new BadRequestException('Session is already paused');
    }

    const now = new Date();


    session.is_paused = true;
    session.pause_time = now;


    session.last_heartbeat = now;

    return this.timeTrackingRepository.save(session);
  }

  async resumeUserPausedSession(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);

    if (!session.is_active) {
      throw new BadRequestException('Cannot resume an inactive session');
    }

    if (!session.is_paused) {
      throw new BadRequestException('Session is not paused');
    }

    const now = new Date();


    if (session.pause_time) {
      const pauseStartTime = new Date(session.pause_time).getTime();
      const pauseEndTime = now.getTime();
      const pauseDurationHours = (pauseEndTime - pauseStartTime) / (1000 * 60 * 60);


      session.paused_duration_hours += parseFloat(pauseDurationHours.toFixed(4));
    }


    session.is_paused = false;
    session.pause_time = null;


    session.last_heartbeat = now;

    return this.timeTrackingRepository.save(session);
  }

  async endSession(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);

    if (!session.is_active) {
      throw new BadRequestException('Session is not active');
    }

    const now = new Date();


    if (session.is_paused && session.pause_time) {
      const pauseStartTime = new Date(session.pause_time).getTime();
      const pauseEndTime = now.getTime();
      const pauseDurationHours = (pauseEndTime - pauseStartTime) / (1000 * 60 * 60);

      session.paused_duration_hours += parseFloat(pauseDurationHours.toFixed(4));
      session.is_paused = false;
    }


    const startTime = new Date(session.created_at).getTime();
    const endTime = now.getTime();
    const totalDurationHours = (endTime - startTime) / (1000 * 60 * 60);
    const actualDurationHours = totalDurationHours - session.paused_duration_hours;


    return this.update(id, {
      end_time: now,
      duration_hours: parseFloat(actualDurationHours.toFixed(4)),
      is_active: false,
      is_paused: false
    });
  }

  async endActiveSessionsForUser(userId: number): Promise<void> {
    const activeSessions = await this.timeTrackingRepository.find({
      where: {
        user_id: userId,
        is_active: true
      }
    });

    for (const session of activeSessions) {
      const now = new Date();


      let actualDurationHours = 0;

      if (session.is_paused && session.pause_time) {

        const startTime = new Date(session.created_at).getTime();
        const pauseTime = new Date(session.pause_time).getTime();
        const totalTime = (pauseTime - startTime) / (1000 * 60 * 60);
        actualDurationHours = totalTime - session.paused_duration_hours;
      } else {

        const startTime = new Date(session.created_at).getTime();
        const endTime = now.getTime();
        const totalTime = (endTime - startTime) / (1000 * 60 * 60);
        actualDurationHours = totalTime - session.paused_duration_hours;
      }

      session.end_time = now;
      session.duration_hours = parseFloat(actualDurationHours.toFixed(2));
      session.is_active = false;
      session.is_paused = false;

      await this.timeTrackingRepository.save(session);
    }
  }

  async findAll(): Promise<TimeTracking[]> {
    return this.timeTrackingRepository.find({
      relations: ['user', 'task'],
    });
  }

  async findAllByUserId(userId: number): Promise<TimeTracking[]> {
    return this.timeTrackingRepository.find({
      where: { user_id: userId },
      relations: ['task'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllByTaskId(taskId: number): Promise<TimeTracking[]> {
    return this.timeTrackingRepository.find({
      where: { task_id: taskId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findActiveSessionByUserId(userId: number): Promise<TimeTracking | null> {
    return this.timeTrackingRepository.findOne({
      where: {
        user_id: userId,
        is_active: true
      },
      relations: ['task'],
    });
  }

  async findAutoPausedSessionsByUserId(userId: number): Promise<TimeTracking[]> {
    return this.timeTrackingRepository.find({
      where: {
        user_id: userId,
        auto_paused: true
      },
      relations: ['task'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllByUserAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<TimeTracking[]> {
    return this.timeTrackingRepository.find({
      where: {
        user_id: userId,
        date: Between(startDate, endDate),
      },
      relations: ['task'],
      order: { date: 'ASC', created_at: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TimeTracking> {
    const timeTracking = await this.timeTrackingRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });

    if (!timeTracking) {
      throw new NotFoundException(`Time tracking with ID ${id} not found`);
    }

    return timeTracking;
  }

  async update(id: number, updateTimeTrackingDto: UpdateTimeTrackingDto): Promise<TimeTracking> {
    const timeTracking = await this.findOne(id);


    if (updateTimeTrackingDto.user_id) {
      await this.usersService.findOne(updateTimeTrackingDto.user_id);
    }

    if (updateTimeTrackingDto.task_id) {
      await this.tasksService.findOne(updateTimeTrackingDto.task_id);
    }


    if (
      updateTimeTrackingDto.end_time &&
      !updateTimeTrackingDto.duration_hours
    ) {

      const startTime = new Date(timeTracking.created_at);
      const endTime = new Date(
        updateTimeTrackingDto.end_time || timeTracking.end_time
      );

      if (endTime) {
        const totalTime = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        const pausedTime = updateTimeTrackingDto.paused_duration_hours !== undefined ?
          updateTimeTrackingDto.paused_duration_hours : timeTracking.paused_duration_hours;

        updateTimeTrackingDto.duration_hours = parseFloat((totalTime - pausedTime).toFixed(2));
      }
    }


    if (updateTimeTrackingDto.is_active === true && !timeTracking.is_active) {
      await this.endActiveSessionsForUser(timeTracking.user_id);
    }

    const updatedTimeTracking = this.timeTrackingRepository.merge(
      timeTracking,
      updateTimeTrackingDto
    );

    return this.timeTrackingRepository.save(updatedTimeTracking);
  }

  async remove(id: number): Promise<void> {
    const result = await this.timeTrackingRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Time tracking with ID ${id} not found`);
    }
  }

  async updateHeartbeat(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);

    if (!session.is_active) {
      throw new BadRequestException('Cannot update heartbeat for inactive session');
    }



    session.last_heartbeat = new Date();
    return this.timeTrackingRepository.save(session);
  }

  @Cron('0 */5 * * * *')
  async checkForStaleTimers() {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - 10);

    const pausedThreshold = new Date();
    pausedThreshold.setMinutes(pausedThreshold.getMinutes() - 30);


    const staleActiveSessions = await this.timeTrackingRepository.find({
      where: {
        is_active: true,
        is_paused: false,
        last_heartbeat: LessThan(threshold)
      }
    });

    for (const session of staleActiveSessions) {

      const startTime = new Date(session.created_at).getTime();
      const heartbeatTime = new Date(session.last_heartbeat).getTime();


      let durationHours = (heartbeatTime - startTime) / (1000 * 60 * 60) - session.paused_duration_hours;


      durationHours = Math.max(0, durationHours);

      session.auto_paused = true;
      session.duration_hours = parseFloat(durationHours.toFixed(2));

      await this.timeTrackingRepository.save(session);
    }


    const stalePausedSessions = await this.timeTrackingRepository.find({
      where: {
        is_active: true,
        is_paused: true,
        last_heartbeat: LessThan(pausedThreshold)
      }
    });

    for (const session of stalePausedSessions) {

      const startTime = new Date(session.created_at).getTime();
      let pauseEndTime: number;

      if (session.pause_time) {

        pauseEndTime = new Date(session.pause_time).getTime();
      } else {

        pauseEndTime = new Date(session.last_heartbeat).getTime();
      }


      let durationHours = (pauseEndTime - startTime) / (1000 * 60 * 60) - session.paused_duration_hours;
      durationHours = Math.max(0, durationHours);

      session.auto_paused = true;
      session.is_paused = false;
      session.duration_hours = parseFloat(durationHours.toFixed(4));
      session.is_active = false;

      await this.timeTrackingRepository.save(session);
    }
  }

  async resumeAutoPausedSession(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);

    if (!session.auto_paused) {
      throw new BadRequestException('Session is not auto-paused');
    }


    const activeSessions = await this.timeTrackingRepository.find({
      where: {
        user_id: session.user_id,
        is_active: true,
        id: Not(id)
      }
    });

    for (const activeSession of activeSessions) {
      await this.endSession(activeSession.id);
    }


    const now = new Date();

    session.auto_paused = false;
    session.is_active = true;
    session.last_heartbeat = now;

    return this.timeTrackingRepository.save(session);
  }

  async getTaskTimeSummary(taskId: number): Promise<{
    task_id: number,
    total_duration_hours: number,
    session_count: number,
    last_session: TimeTracking | null;
  }> {
    const timeTrackings = await this.findAllByTaskId(taskId);
    const task = await this.tasksService.findOne(taskId);


    const completedSessions = timeTrackings.filter(t => !t.is_active);


    const activeSession = timeTrackings.find(t => t.is_active) || null;


    const totalDurationHours = completedSessions.reduce(
      (total, tracking) => total + (tracking.duration_hours || 0),
      0
    );


    const allSessions = [...timeTrackings];
    allSessions.sort((a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    const lastSession = allSessions.length > 0 ? allSessions[0] : null;


    const progress = task.estimated_time
      ? Math.min(Math.round((totalDurationHours / task.estimated_time) * 100), 100)
      : 0;

    return {
      task_id: taskId,
      total_duration_hours: totalDurationHours,
      session_count: timeTrackings.length,
      last_session: lastSession
    };
  }

  async getUserProductivity(userId: number, days: number = 7): Promise<{
    userId: number;
    period: string;
    totalHours: number;
    averageHoursPerDay: number;
    dailyBreakdown: { date: string; hours: number; taskCount: number }[];
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const timeTrackings = await this.findAllByUserAndDateRange(
      userId,
      startDate,
      endDate
    );


    const dailyTotals = {};
    const tasksPerDay = {};

    timeTrackings.forEach(tracking => {

      const dateObj = tracking.date instanceof Date ?
        tracking.date :
        new Date(tracking.date);

      const dateStr = dateObj.toISOString().split('T')[0];

      if (!dailyTotals[dateStr]) {
        dailyTotals[dateStr] = 0;
        tasksPerDay[dateStr] = new Set();
      }

      dailyTotals[dateStr] += tracking.duration_hours || 0;
      tasksPerDay[dateStr].add(tracking.task_id);
    });


    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      if (!dailyTotals[dateStr]) {
        dailyTotals[dateStr] = 0;
        tasksPerDay[dateStr] = new Set();
      }
    }


    const dailyBreakdown = Object.keys(dailyTotals)
      .sort()
      .map(date => ({
        date,
        hours: parseFloat(dailyTotals[date].toFixed(2)),
        taskCount: tasksPerDay[date].size,
      }));

    const totalHours = parseFloat(
      timeTrackings
        .reduce((total, t) => total + (t.duration_hours || 0), 0)
        .toFixed(2)
    );

    const averageHoursPerDay = parseFloat(
      (totalHours / days).toFixed(2)
    );

    return {
      userId,
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      totalHours,
      averageHoursPerDay,
      dailyBreakdown,
    };
  }
}