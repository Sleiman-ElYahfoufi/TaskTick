import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project, ProjectStatus, PriorityLevel, DetailDepth } from './entities/project.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { Task } from '../tasks/entities/task.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: Repository<Project>;
  let taskRepository: Repository<Task>;
  let usersService: UsersService;

  const mockProject = {
    id: 1,
    name: 'Test Project',
    description: 'Test description',
    deadline: new Date(),
    priority: PriorityLevel.MEDIUM,
    detail_depth: DetailDepth.NORMAL,
    status: ProjectStatus.PLANNING,
    estimated_time: 20,
    accuracy_rating: 0,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    user: {} as any,
    tasks: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              setParameter: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              setParameter: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'Description',
        estimated_time: 10,
        user_id: 1,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(projectRepository, 'create').mockReturnValue(mockProject as any);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(mockProject as any);

      const result = await service.create(createProjectDto as any);

      expect(usersService.findOne).toHaveBeenCalledWith(createProjectDto.user_id);
      expect(projectRepository.create).toHaveBeenCalledWith(createProjectDto);
      expect(projectRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = [mockProject];
      jest.spyOn(projectRepository, 'find').mockResolvedValue(projects as any);
      jest.spyOn(taskRepository, 'createQueryBuilder').mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      }) as any);

      const result = await service.findAll();

      expect(projectRepository.find).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });

    it('should find projects by status', async () => {
      const projects = [mockProject];
      jest.spyOn(projectRepository, 'find').mockResolvedValue(projects as any);
      jest.spyOn(taskRepository, 'createQueryBuilder').mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      }) as any);

      const result = await service.findByStatus(ProjectStatus.PLANNING);

      expect(projectRepository.find).toHaveBeenCalledWith({
        where: { status: ProjectStatus.PLANNING }
      });
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject as any);

      const result = await service.findOne(1);

      expect(projectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['tasks']
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto = {
        name: 'Updated Project',
      };

      const updatedProject = {
        ...mockProject,
        name: updateProjectDto.name,
      };

      jest.spyOn(projectRepository, 'findOne').mockResolvedValueOnce(mockProject as any);
      jest.spyOn(projectRepository, 'merge').mockReturnValue(updatedProject as any);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(updatedProject as any);
      jest.spyOn(taskRepository, 'find').mockResolvedValue([]);
      
      // Handle the 2nd findOne call in updateProjectStatus
      jest.spyOn(projectRepository, 'findOne')
        .mockResolvedValueOnce(mockProject as any)
        .mockResolvedValueOnce(updatedProject as any);

      const result = await service.update(1, updateProjectDto as any);

      expect(projectRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        relations: ['tasks']
      });
      expect(projectRepository.merge).toHaveBeenCalledWith(mockProject, updateProjectDto);
      expect(projectRepository.save).toHaveBeenCalled();
      expect(result.name).toEqual(updateProjectDto.name);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      jest.spyOn(projectRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(projectRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(projectRepository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});