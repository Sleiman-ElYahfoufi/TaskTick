import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project, ProjectStatus, PriorityLevel, DetailDepth } from './entities/project.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;
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
    user: {} as any, // Mock a user object
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
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
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
      jest.spyOn(repository, 'create').mockReturnValue(mockProject);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProject);

      const result = await service.create(createProjectDto as any);

      expect(usersService.findOne).toHaveBeenCalledWith(createProjectDto.user_id);
      expect(repository.create).toHaveBeenCalledWith(createProjectDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects = [mockProject];
      jest.spyOn(repository, 'find').mockResolvedValue(projects);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
    
    it('should find projects by status', async () => {
      const projects = [mockProject];
      jest.spyOn(repository, 'find').mockResolvedValue(projects);
      
      const result = await service.findByStatus(ProjectStatus.PLANNING);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { status: ProjectStatus.PLANNING }
      });
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProject);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto = {
        name: 'Updated Project',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockProject,
        name: updateProjectDto.name,
      });
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockProject,
        name: updateProjectDto.name,
      });

      const result = await service.update(1, updateProjectDto as any);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(mockProject, updateProjectDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toEqual(updateProjectDto.name);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if project not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});