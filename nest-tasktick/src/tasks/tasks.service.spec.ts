import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, PriorityLevel } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;
  let projectsService: ProjectsService;

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
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
          provide: ProjectsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        name: 'New Task',
        description: 'Description',
        estimated_time: 5,
        project_id: 1,
      };

      jest.spyOn(projectsService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'create').mockReturnValue(mockTask);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto as any);

      expect(projectsService.findOne).toHaveBeenCalledWith(createTaskDto.project_id);
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [mockTask];
      jest.spyOn(repository, 'find').mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
    
    it('should find tasks by status', async () => {
      const tasks = [mockTask];
      jest.spyOn(repository, 'find').mockResolvedValue(tasks);
      
      const result = await service.findAllByStatus(TaskStatus.TODO);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { status: TaskStatus.TODO }
      });
      expect(result).toEqual(tasks);
    });
    
    it('should find tasks by project ID', async () => {
      const tasks = [mockTask];
      jest.spyOn(repository, 'find').mockResolvedValue(tasks);
      
      const result = await service.findAllByProjectId(1);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { project_id: 1 }
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto = {
        name: 'Updated Task',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockTask,
        name: updateTaskDto.name,
      });
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockTask,
        name: updateTaskDto.name,
      });

      const result = await service.update(1, updateTaskDto as any);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(mockTask, updateTaskDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toEqual(updateTaskDto.name);
    });

    it('should verify project exists when updating project_id', async () => {
      const updateTaskDto = {
        project_id: 2,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(projectsService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockTask,
        project_id: updateTaskDto.project_id,
      });
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockTask,
        project_id: updateTaskDto.project_id,
      });

      const result = await service.update(1, updateTaskDto as any);

      expect(projectsService.findOne).toHaveBeenCalledWith(updateTaskDto.project_id);
      expect(result.project_id).toEqual(updateTaskDto.project_id);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});