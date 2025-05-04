import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTechStacksService } from './user-tech-stacks.service';
import { UserTechStack } from './entities/user-tech-stack.entity';
import { UsersService } from '../users/users.service';
import { TechStacksService } from '../tech-stacks/tech-stacks.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserTechStacksService', () => {
  let service: UserTechStacksService;
  let repository: Repository<UserTechStack>;
  let usersService: UsersService;
  let techStacksService: TechStacksService;

  const mockUserTechStack = {
    user_id: 1,
    tech_id: 1,
    proficiency_level: 3,
    created_at: new Date(),
    updated_at: new Date(),
    user: {} as any,
    techStack: {} as any
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTechStacksService,
        {
          provide: getRepositoryToken(UserTechStack),
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
          provide: TechStacksService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserTechStacksService>(UserTechStacksService);
    repository = module.get<Repository<UserTechStack>>(getRepositoryToken(UserTechStack));
    usersService = module.get<UsersService>(UsersService);
    techStacksService = module.get<TechStacksService>(TechStacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user tech stack', async () => {
      const createUserTechStackDto = {
        user_id: 1,
        tech_id: 1,
        proficiency_level: 3
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(techStacksService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockUserTechStack);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUserTechStack);

      const result = await service.create(createUserTechStackDto);

      expect(usersService.findOne).toHaveBeenCalledWith(createUserTechStackDto.user_id);
      expect(techStacksService.findOne).toHaveBeenCalledWith(createUserTechStackDto.tech_id);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(createUserTechStackDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUserTechStack);
    });

    it('should throw ConflictException if user-tech combination already exists', async () => {
      const createUserTechStackDto = {
        user_id: 1,
        tech_id: 1,
        proficiency_level: 3
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(techStacksService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUserTechStack);

      await expect(service.create(createUserTechStackDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of user tech stacks', async () => {
      const userTechStacks = [mockUserTechStack];
      jest.spyOn(repository, 'find').mockResolvedValue(userTechStacks);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['user', 'techStack']
      });
      expect(result).toEqual(userTechStacks);
    });
  });

  describe('findByUserId', () => {
    it('should return user tech stacks for a specific user', async () => {
      const userTechStacks = [mockUserTechStack];
      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'find').mockResolvedValue(userTechStacks);
      
      const result = await service.findByUserId(1);
      
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { user_id: 1 },
        relations: ['techStack']
      });
      expect(result).toEqual(userTechStacks);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValue(
        new NotFoundException('User with ID 999 not found')
      );

      await expect(service.findByUserId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTechId', () => {
    it('should return user tech stacks for a specific tech stack', async () => {
      const userTechStacks = [mockUserTechStack];
      jest.spyOn(techStacksService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'find').mockResolvedValue(userTechStacks);
      
      const result = await service.findByTechId(1);
      
      expect(techStacksService.findOne).toHaveBeenCalledWith(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { tech_id: 1 },
        relations: ['user']
      });
      expect(result).toEqual(userTechStacks);
    });

    it('should throw NotFoundException if tech stack not found', async () => {
      jest.spyOn(techStacksService, 'findOne').mockRejectedValue(
        new NotFoundException('Tech stack with ID 999 not found')
      );

      await expect(service.findByTechId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a user tech stack by user_id and tech_id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUserTechStack);

      const result = await service.findOne(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1, tech_id: 1 },
        relations: ['user', 'techStack']
      });
      expect(result).toEqual(mockUserTechStack);
    });

    it('should throw NotFoundException if user tech stack not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user tech stack', async () => {
      const updateUserTechStackDto = {
        proficiency_level: 4
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUserTechStack);
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockUserTechStack,
        proficiency_level: updateUserTechStackDto.proficiency_level,
      });
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockUserTechStack,
        proficiency_level: updateUserTechStackDto.proficiency_level,
      });

      const result = await service.update(1, 1, updateUserTechStackDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.merge).toHaveBeenCalledWith(mockUserTechStack, updateUserTechStackDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.proficiency_level).toEqual(updateUserTechStackDto.proficiency_level);
    });

    it('should check for conflicts when changing user_id or tech_id', async () => {
      const updateUserTechStackDto = {
        user_id: 2,
        tech_id: 2
      };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockUserTechStack) 
        .mockResolvedValueOnce(null); 

      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(techStacksService, 'findOne').mockResolvedValue({} as any);
      
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockUserTechStack,
        user_id: updateUserTechStackDto.user_id,
        tech_id: updateUserTechStackDto.tech_id,
      });
      
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockUserTechStack,
        user_id: updateUserTechStackDto.user_id,
        tech_id: updateUserTechStackDto.tech_id,
      });

      const result = await service.update(1, 1, updateUserTechStackDto);

      expect(usersService.findOne).toHaveBeenCalledWith(updateUserTechStackDto.user_id);
      expect(techStacksService.findOne).toHaveBeenCalledWith(updateUserTechStackDto.tech_id);
      expect(result.user_id).toEqual(updateUserTechStackDto.user_id);
      expect(result.tech_id).toEqual(updateUserTechStackDto.tech_id);
    });

    it('should throw ConflictException if new combination already exists', async () => {
      const updateUserTechStackDto = {
        user_id: 2,
        tech_id: 2
      };

      const existingEntry = {
        ...mockUserTechStack,
        user_id: 2,
        tech_id: 2
      };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockUserTechStack) 
        .mockResolvedValueOnce(existingEntry); 

      await expect(service.update(1, 1, updateUserTechStackDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if user tech stack not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, 999, { proficiency_level: 5 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user tech stack', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1, 1);

      expect(repository.delete).toHaveBeenCalledWith({
        user_id: 1,
        tech_id: 1
      });
    });

    it('should throw NotFoundException if user tech stack not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999, 999)).rejects.toThrow(NotFoundException);
    });
  });
});