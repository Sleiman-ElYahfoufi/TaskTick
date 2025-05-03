import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, ExperienceLevel } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashed_password',
    role: UserRole.SOFTWARE_ENGINEER,
    experience_level: ExperienceLevel.INTERMEDIATE,
    created_at: new Date(),
    updated_at: new Date(),
    projects: [],
    timeTrackings: [],
    userTechStacks: [],
    aiInsights: []
  } as User;

  const mockUserResponse = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: UserRole.SOFTWARE_ENGINEER,
    experience_level: ExperienceLevel.INTERMEDIATE,
    created_at: new Date(),
    updated_at: new Date(),
    projects: [],
    timeTrackings: [],
    userTechStacks: [],
    aiInsights: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn().mockResolvedValue('mock-token'),
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        role: UserRole.SOFTWARE_ENGINEER,
        experience_level: ExperienceLevel.INTERMEDIATE
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUserResponse);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.user).toEqual(mockUserResponse);
    });

    it('should handle ConflictException from service', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'password123',
        email: 'existing@example.com',
        role: UserRole.SOFTWARE_ENGINEER,
        experience_level: ExperienceLevel.INTERMEDIATE
      };

      jest.spyOn(service, 'create').mockRejectedValue(
        new ConflictException('Username or email already exists')
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser, { ...mockUser, id: 2, username: 'user2' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return an empty array if no users exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should handle NotFoundException from service', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('User with ID 999 not found')
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('should convert string id to number', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com'
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should handle NotFoundException from service', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser'
      };

      jest.spyOn(service, 'update').mockRejectedValue(
        new NotFoundException('User with ID 999 not found')
      );

      await expect(controller.update('999', updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle ConflictException from service', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'existinguser'
      };

      jest.spyOn(service, 'update').mockRejectedValue(
        new ConflictException('Username or email already exists')
      );

      await expect(controller.update('1', updateUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should handle NotFoundException from service', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new NotFoundException('User with ID 999 not found')
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});