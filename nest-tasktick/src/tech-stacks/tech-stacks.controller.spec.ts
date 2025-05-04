import { Test, TestingModule } from '@nestjs/testing';
import { TechStacksController } from './tech-stacks.controller';
import { TechStacksService } from './tech-stacks.service';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { TechStack, TechCategory } from './entities/tech-stack.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('TechStacksController', () => {
  let controller: TechStacksController;
  let service: TechStacksService;

  const mockTechStack = {
    id: 1,
    name: 'React',
    category: TechCategory.FRONTEND,
    created_at: new Date(),
    updated_at: new Date(),
    userTechStacks: []
  } as TechStack;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [TechStacksController],
      providers: [
        {
          provide: TechStacksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByCategory: jest.fn(),
            findByName: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<TechStacksController>(TechStacksController);
    service = module.get<TechStacksService>(TechStacksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tech stack', async () => {
      const createTechStackDto: CreateTechStackDto = {
        name: 'React',
        category: TechCategory.FRONTEND
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockTechStack);

      const result = await controller.create(createTechStackDto);

      expect(service.create).toHaveBeenCalledWith(createTechStackDto);
      expect(result).toEqual(mockTechStack);
    });

    it('should handle ConflictException', async () => {
      const createTechStackDto: CreateTechStackDto = {
        name: 'React',
        category: TechCategory.FRONTEND
      };

      jest.spyOn(service, 'create').mockRejectedValue(
        new ConflictException('Tech stack with name "React" already exists')
      );

      await expect(controller.create(createTechStackDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all tech stacks', async () => {
      const techStacks = [mockTechStack];
      jest.spyOn(service, 'findAll').mockResolvedValue(techStacks);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(techStacks);
    });

    it('should find tech stacks by name', async () => {
      const techStacks = [mockTechStack];
      jest.spyOn(service, 'findByName').mockResolvedValue(techStacks);

      const result = await controller.findAll('React');

      expect(service.findByName).toHaveBeenCalledWith('React');
      expect(result).toEqual(techStacks);
    });

    it('should find tech stacks by category', async () => {
      const techStacks = [mockTechStack];
      jest.spyOn(service, 'findByCategory').mockResolvedValue(techStacks);

      const result = await controller.findAll(undefined, TechCategory.FRONTEND);

      expect(service.findByCategory).toHaveBeenCalledWith(TechCategory.FRONTEND);
      expect(result).toEqual(techStacks);
    });
  });

  describe('findOne', () => {
    it('should return a tech stack by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTechStack);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTechStack);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('Tech stack with ID 999 not found')
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tech stack', async () => {
      const updateTechStackDto: UpdateTechStackDto = {
        name: 'React-Updated',
      };

      const updatedTechStack = { ...mockTechStack, ...updateTechStackDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedTechStack);

      const result = await controller.update('1', updateTechStackDto);

      expect(service.update).toHaveBeenCalledWith(1, updateTechStackDto);
      expect(result).toEqual(updatedTechStack);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new NotFoundException('Tech stack with ID 999 not found')
      );

      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });

    it('should handle ConflictException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new ConflictException('Tech stack with name "Angular" already exists')
      );

      await expect(controller.update('1', { name: 'Angular' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a tech stack', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new NotFoundException('Tech stack with ID 999 not found')
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});