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
  ) {}

  async create(createTimeTrackingDto: CreateTimeTrackingDto): Promise<TimeTracking> {
    // Verify user and task exist
    await this.usersService.findOne(createTimeTrackingDto.user_id);
    await this.tasksService.findOne(createTimeTrackingDto.task_id);
    
    // Calculate duration if end_time is provided
    if (createTimeTrackingDto.end_time && !createTimeTrackingDto.duration_hours) {
      const startTime = new Date(createTimeTrackingDto.start_time);
      const endTime = new Date(createTimeTrackingDto.end_time);
      
      // Calculate duration in hours
      const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      createTimeTrackingDto.duration_hours = parseFloat(durationInHours.toFixed(2));
    }
    
    // If entry is active, make sure no other active sessions exist for this user
    if (createTimeTrackingDto.is_active) {
      await this.endActiveSessionsForUser(createTimeTrackingDto.user_id);
    }
    
    // Set last_heartbeat to current time for new active sessions
    if (createTimeTrackingDto.is_active) {
      createTimeTrackingDto['last_heartbeat'] = new Date();
    }
    
    const timeTracking = this.timeTrackingRepository.create(createTimeTrackingDto);
    return this.timeTrackingRepository.save(timeTracking);
  }

  async startUserTaskSession(userId: number, taskId: number): Promise<TimeTracking> {
    // End any active sessions for this user
    await this.endActiveSessionsForUser(userId);
    
    // Verify user and task exist
    await this.usersService.findOne(userId);
    await this.tasksService.findOne(taskId);
    
    // Create a new session
    const now = new Date();
    const createDto: CreateTimeTrackingDto = {
      user_id: userId,
      task_id: taskId,
      start_time: now,
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
    
    // Update the session
    session.is_paused = true;
    session.pause_time = now;
    
    // Update last heartbeat as well
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
    
    // Calculate time spent in pause - with null safety check
    if (session.pause_time) {
      const pauseStartTime = new Date(session.pause_time).getTime();
      const pauseEndTime = now.getTime();
      const pauseDurationHours = (pauseEndTime - pauseStartTime) / (1000 * 60 * 60);
      
      // Update paused duration counter
      session.paused_duration_hours += parseFloat(pauseDurationHours.toFixed(2));
    }
    
    // Resume the session
    session.is_paused = false;
    session.pause_time = null;
    
    // Update last heartbeat
    session.last_heartbeat = now;
    
    return this.timeTrackingRepository.save(session);
  }

  async endSession(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);
    
    if (!session.is_active) {
      throw new BadRequestException('Session is not active');
    }
    
    const now = new Date();
    
    // If the session is paused, calculate additional pause time
    if (session.is_paused && session.pause_time) {
      const pauseStartTime = new Date(session.pause_time).getTime();
      const pauseEndTime = now.getTime();
      const pauseDurationHours = (pauseEndTime - pauseStartTime) / (1000 * 60 * 60);
      
      session.paused_duration_hours += parseFloat(pauseDurationHours.toFixed(2));
      session.is_paused = false;
    }
    
    // Calculate actual duration (excluding paused time)
    const startTime = new Date(session.start_time).getTime();
    const endTime = now.getTime();
    const totalDurationHours = (endTime - startTime) / (1000 * 60 * 60);
    const actualDurationHours = totalDurationHours - session.paused_duration_hours;
    
    return this.update(id, {
      end_time: now,
      duration_hours: parseFloat(actualDurationHours.toFixed(2)),
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
      
      // Handle paused sessions
      let actualDurationHours = 0;
      
      if (session.is_paused && session.pause_time) {
        // If paused, calculate duration up to pause time
        const startTime = new Date(session.start_time).getTime();
        const pauseTime = new Date(session.pause_time).getTime();
        const totalTime = (pauseTime - startTime) / (1000 * 60 * 60);
        actualDurationHours = totalTime - session.paused_duration_hours;
      } else {
        // If not paused, calculate duration up to now
        const startTime = new Date(session.start_time).getTime();
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
      order: { start_time: 'DESC' },
    });
  }
  
  async findAllByTaskId(taskId: number): Promise<TimeTracking[]> {
    return this.timeTrackingRepository.find({
      where: { task_id: taskId },
      relations: ['user'],
      order: { start_time: 'DESC' },
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
      order: { start_time: 'DESC' },
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
      order: { date: 'ASC', start_time: 'ASC' },
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
    
    // Verify relations if they're being updated
    if (updateTimeTrackingDto.user_id) {
      await this.usersService.findOne(updateTimeTrackingDto.user_id);
    }
    
    if (updateTimeTrackingDto.task_id) {
      await this.tasksService.findOne(updateTimeTrackingDto.task_id);
    }
    
    // Recalculate duration if times are updated
    if (
      (updateTimeTrackingDto.start_time || updateTimeTrackingDto.end_time) && 
      !updateTimeTrackingDto.duration_hours
    ) {
      const startTime = new Date(
        updateTimeTrackingDto.start_time || timeTracking.start_time
      );
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
    
    // If changing to active, ensure no other active sessions
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
    
    // Only update heartbeat if session is not paused
    // We still accept the heartbeat to acknowledge the client is alive
    if (!session.is_paused) {
      session.last_heartbeat = new Date();
      return this.timeTrackingRepository.save(session);
    }
    
    return session;
  }
  
  @Cron('0 */5 * * * *') // Run every 5 minutes
  async checkForStaleTimers() {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - 10); // 10 minute threshold
    
    const staleSessions = await this.timeTrackingRepository.find({
      where: {
        is_active: true,
        is_paused: false, // Only check non-paused sessions
        last_heartbeat: LessThan(threshold)
      }
    });
    
    for (const session of staleSessions) {
      // Calculate time until last heartbeat
      const startTime = new Date(session.start_time).getTime();
      const heartbeatTime = new Date(session.last_heartbeat).getTime();
      
      // Subtract any previously paused time
      const durationHours = (heartbeatTime - startTime) / (1000 * 60 * 60) - session.paused_duration_hours;
      
      session.auto_paused = true;
      session.duration_hours = parseFloat(durationHours.toFixed(2));
      
      await this.timeTrackingRepository.save(session);
    }
  }
  
  async resumeAutoPausedSession(id: number): Promise<TimeTracking> {
    const session = await this.findOne(id);
    
    if (!session.auto_paused) {
      throw new BadRequestException('Session is not auto-paused');
    }
    
    // End any current active sessions for this user (other than this one)
    const activeSessions = await this.timeTrackingRepository.find({
      where: {
        user_id: session.user_id,
        is_active: true,
        id: Not(id) // Exclude the current session
      }
    });
    
    for (const activeSession of activeSessions) {
      await this.endSession(activeSession.id);
    }
    
    // Update the session to no longer be auto-paused
    const now = new Date();
    
    session.auto_paused = false;
    session.is_active = true;
    session.last_heartbeat = now;
    
    return this.timeTrackingRepository.save(session);
  }
  
  async getTaskTimeSummary(taskId: number): Promise<{
    sessions: number;
    totalTime: string;
    progress: number;
    activeSession: TimeTracking | null;
  }> {
    const timeTrackings = await this.findAllByTaskId(taskId);
    const task = await this.tasksService.findOne(taskId);
    
    // Find all completed sessions
    const completedSessions = timeTrackings.filter(t => !t.is_active);
    
    // Find active session if any
    const activeSession = timeTrackings.find(t => t.is_active) || null;
    
    // Calculate total duration from completed sessions
    const totalDurationHours = completedSessions.reduce(
      (total, tracking) => total + (tracking.duration_hours || 0), 
      0
    );
    
    // Format total duration as "Xh Ym total"
    const hours = Math.floor(totalDurationHours);
    const minutes = Math.round((totalDurationHours - hours) * 60);
    const totalTime = `${hours}h ${minutes}m total`;
    
    // Calculate progress percentage
    const progress = Math.min(
      Math.round((totalDurationHours / task.estimated_time) * 100),
      100
    );
    
    return {
      sessions: completedSessions.length,
      totalTime,
      progress,
      activeSession
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
    startDate.setDate(startDate.getDate() - days + 1); // Include today
    
    const timeTrackings = await this.findAllByUserAndDateRange(
      userId, 
      startDate, 
      endDate
    );
    
    // Calculate daily totals
    const dailyTotals = {};
    const tasksPerDay = {};
    
    timeTrackings.forEach(tracking => {
      const dateStr = tracking.date.toISOString().split('T')[0];
      
      if (!dailyTotals[dateStr]) {
        dailyTotals[dateStr] = 0;
        tasksPerDay[dateStr] = new Set();
      }
      
      dailyTotals[dateStr] += tracking.duration_hours || 0;
      tasksPerDay[dateStr].add(tracking.task_id);
    });
    
    // Fill in missing days
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!dailyTotals[dateStr]) {
        dailyTotals[dateStr] = 0;
        tasksPerDay[dateStr] = new Set();
      }
    }
    
    // Convert to array format for easier consumption
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