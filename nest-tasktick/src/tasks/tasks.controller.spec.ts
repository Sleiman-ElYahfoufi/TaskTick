import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus, PriorityLevel } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectsService } from '../projects/projects.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask = {
    id: 1,
    name: 'Test Task',
    description: 'Test description',
    estimated_time: 5,
    dueDate: new Date(),
    priority: PriorityLevel.MEDIUM,
    status: TaskStatus.TODO,
    progress: 0,
    project_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    project: {} as any,
    timeTrackings: []
  } as Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn(),
            findTasksForUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            createTaskWithOwnerCheck: jest.fn(),
          },
        },
        {
          provide: ProjectsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'New Task',
        description: 'Test description',
        estimated_time: 5,
        project_id: 1,
      };

      const userId = 1;
      
      jest.spyOn(service, 'createTaskWithOwnerCheck').mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto, userId);

      expect(service.createTaskWithOwnerCheck).toHaveBeenCalledWith(createTaskDto, userId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const userId = 1;
      const tasks = [mockTask];
      jest.spyOn(service, 'findTasksForUser').mockResolvedValue(tasks);

      const result = await controller.findAll(userId);

      expect(service.findTasksForUser).toHaveBeenCalledWith(userId, {});
      expect(result).toEqual(tasks);
    });

    it('should find tasks by project ID', async () => {
      const userId = 1;
      const projectId = '1';
      const tasks = [mockTask];
      jest.spyOn(service, 'findTasksForUser').mockResolvedValue(tasks);

      const result = await controller.findAll(userId, projectId);

      expect(service.findTasksForUser).toHaveBeenCalledWith(userId, { projectId: 1 });
      expect(result).toEqual(tasks);
    });

    it('should find tasks by status', async () => {
      const userId = 1;
      const tasks = [mockTask];
      jest.spyOn(service, 'findTasksForUser').mockResolvedValue(tasks);

      const result = await controller.findAll(userId, undefined, TaskStatus.TODO);

      expect(service.findTasksForUser).toHaveBeenCalledWith(userId, { status: TaskStatus.TODO });
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('Task with ID 999 not found')
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        name: 'Updated Task',
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedTask);

      const result = await controller.update('1', updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result).toEqual(updatedTask);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new NotFoundException('Task with ID 999 not found')
      );

      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new NotFoundException('Task with ID 999 not found')
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});