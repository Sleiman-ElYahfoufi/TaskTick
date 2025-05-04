import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeTrackingsService } from './time-trackings.service';
import { TimeTracking } from './entities/time-tracking.entity';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { NotFoundException } from '@nestjs/common';

describe('TimeTrackingsService', () => {
  let service: TimeTrackingsService;
  let repository: Repository<TimeTracking>;
  let usersService: UsersService;
  let tasksService: TasksService;

  const mockTimeTracking = {
    id: 1,
    user_id: 1,
    task_id: 1,
    start_time: new Date(),
    end_time: new Date(),
    session_duration: 2.5,
    date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    user: {} as any,
    task: {} as any
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeTrackingsService,
        {
          provide: getRepositoryToken(TimeTracking),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TasksService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TimeTrackingsService>(TimeTrackingsService);
    repository = module.get<Repository<TimeTracking>>(getRepositoryToken(TimeTracking));
    usersService = module.get<UsersService>(UsersService);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});