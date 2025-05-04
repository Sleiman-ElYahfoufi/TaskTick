import { Test, TestingModule } from '@nestjs/testing';
import { UserTechStacksController } from './user-tech-stacks.controller';
import { UserTechStacksService } from './user-tech-stacks.service';
import { CreateUserTechStackDto } from './dto/create-user-tech-stack.dto';
import { UpdateUserTechStackDto } from './dto/update-user-tech-stack.dto';
import { UserTechStack } from './entities/user-tech-stack.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('UserTechStacksController', () => {
  let controller: UserTechStacksController;
  let service: UserTechStacksService;

  const mockUserTechStack = {
    user_id: 1,
    tech_id: 1,
    proficiency_level: 3,
    created_at: new Date(),
    updated_at: new Date(),
    user: {} as any,
    techStack: {} as any
  } as UserTechStack;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UserTechStacksController],
      providers: [
        {
          provide: UserTechStacksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            findByTechId: jest.fn(),
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

    controller = module.get<UserTechStacksController>(UserTechStacksController);
    service = module.get<UserTechStacksService>(UserTechStacksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user tech stack', async () => {
      const createUserTechStackDto: CreateUserTechStackDto = {
        user_id: 1,
        tech_id: 1,
        proficiency_level: 3
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUserTechStack);

      const result = await controller.create(createUserTechStackDto);

      expect(service.create).toHaveBeenCalledWith(createUserTechStackDto);
      expect(result).toEqual(mockUserTechStack);
    });

    it('should handle ConflictException', async () => {
      const createUserTechStackDto: CreateUserTechStackDto = {
        user_id: 1,
        tech_id: 1,
        proficiency_level: 3
      };

      jest.spyOn(service, 'create').mockRejectedValue(
        new ConflictException('This user already has this tech stack associated')
      );

      await expect(controller.create(createUserTechStackDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all user tech stacks', async () => {
      const userTechStacks = [mockUserTechStack];
      jest.spyOn(service, 'findAll').mockResolvedValue(userTechStacks);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(userTechStacks);
    });

    it('should find user tech stacks by user ID', async () => {
      const userTechStacks = [mockUserTechStack];
      jest.spyOn(service, 'findByUserId').mockResolvedValue(userTechStacks);

      const result = await controller.findAll('1');

      expect(service.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(userTechStacks);
    });

    it('should find user tech stacks by tech ID', async () => {
      const userTechStacks = [mockUserTechStack];
      jest.spyOn(service, 'findByTechId').mockResolvedValue(userTechStacks);

      const result = await controller.findAll(undefined, '1');

      expect(service.findByTechId).toHaveBeenCalledWith(1);
      expect(result).toEqual(userTechStacks);
    });
  });

  describe('findOne', () => {
    it('should return a user tech stack by user_id and tech_id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUserTechStack);

      const result = await controller.findOne('1', '1');

      expect(service.findOne).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockUserTechStack);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('User tech stack not found')
      );

      await expect(controller.findOne('999', '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user tech stack', async () => {
      const updateUserTechStackDto: UpdateUserTechStackDto = {
        proficiency_level: 4,
      };

      const updatedUserTechStack = { ...mockUserTechStack, ...updateUserTechStackDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUserTechStack);

      const result = await controller.update('1', '1', updateUserTechStackDto);

      expect(service.update).toHaveBeenCalledWith(1, 1, updateUserTechStackDto);
      expect(result).toEqual(updatedUserTechStack);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new NotFoundException('User tech stack not found')
      );

      await expect(controller.update('999', '999', {})).rejects.toThrow(NotFoundException);
    });

    it('should handle ConflictException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new ConflictException('This user already has this tech stack associated')
      );

      await expect(controller.update('1', '1', { user_id: 2, tech_id: 2 })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a user tech stack', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1', '1');

      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new NotFoundException('User tech stack not found')
      );

      await expect(controller.remove('999', '999')).rejects.toThrow(NotFoundException);
    });
  });
});