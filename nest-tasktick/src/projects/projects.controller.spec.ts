import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, DetailDepth, PriorityLevel, ProjectStatus } from './entities/project.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

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
  } as Project;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllByUserId: jest.fn(),
            findOne: jest.fn(),
            findByName: jest.fn(),
            findByStatus: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'New Project',
        description: 'Test description',
        estimated_time: 10,
        user_id: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockProject);

      const result = await controller.create(createProjectDto);

      expect(service.create).toHaveBeenCalledWith(createProjectDto);
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [mockProject];
      jest.spyOn(service, 'findAll').mockResolvedValue(projects);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });

    it('should find projects by name', async () => {
      const projects = [mockProject];
      jest.spyOn(service, 'findByName').mockResolvedValue(projects);

      const result = await controller.findAll('Test');

      expect(service.findByName).toHaveBeenCalledWith('Test');
      expect(result).toEqual(projects);
    });

    it('should find projects by status', async () => {
      const projects = [mockProject];
      jest.spyOn(service, 'findByStatus').mockResolvedValue(projects);

      const result = await controller.findAll(undefined, ProjectStatus.PLANNING);

      expect(service.findByStatus).toHaveBeenCalledWith(ProjectStatus.PLANNING);
      expect(result).toEqual(projects);
    });

    it('should find projects by user id', async () => {
      const projects = [mockProject];
      jest.spyOn(service, 'findAllByUserId').mockResolvedValue(projects);

      const result = await controller.findAll(undefined, undefined, '1');

      expect(service.findAllByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProject);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProject);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('Project with ID 999 not found')
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto: UpdateProjectDto = {
        name: 'Updated Project',
      };

      const updatedProject = { ...mockProject, ...updateProjectDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedProject);

      const result = await controller.update('1', updateProjectDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProjectDto);
      expect(result).toEqual(updatedProject);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new NotFoundException('Project with ID 999 not found')
      );

      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new NotFoundException('Project with ID 999 not found')
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});