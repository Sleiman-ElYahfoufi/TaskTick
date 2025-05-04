import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechStacksService } from './tech-stacks.service';
import { TechStack, TechCategory } from './entities/tech-stack.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TechStacksService', () => {
  let service: TechStacksService;
  let repository: Repository<TechStack>;

  const mockTechStack = {
    id: 1,
    name: 'React',
    category: TechCategory.FRONTEND,
    created_at: new Date(),
    updated_at: new Date(),
    userTechStacks: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechStacksService,
        {
          provide: getRepositoryToken(TechStack),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TechStacksService>(TechStacksService);
    repository = module.get<Repository<TechStack>>(getRepositoryToken(TechStack));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tech stack', async () => {
      const createTechStackDto = {
        name: 'React',
        category: TechCategory.FRONTEND,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockTechStack);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTechStack);

      const result = await service.create(createTechStackDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(createTechStackDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTechStack);
    });

    it('should throw ConflictException if tech stack name already exists', async () => {
      const createTechStackDto = {
        name: 'React',
        category: TechCategory.FRONTEND,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTechStack);

      await expect(service.create(createTechStackDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of tech stacks', async () => {
      const techStacks = [mockTechStack];
      jest.spyOn(repository, 'find').mockResolvedValue(techStacks);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(techStacks);
    });
  });

  describe('findByCategory', () => {
    it('should return tech stacks of a specific category', async () => {
      const techStacks = [mockTechStack];
      jest.spyOn(repository, 'find').mockResolvedValue(techStacks);
      
      const result = await service.findByCategory(TechCategory.FRONTEND);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { category: TechCategory.FRONTEND }
      });
      expect(result).toEqual(techStacks);
    });
  });

  describe('findByName', () => {
    it('should return tech stacks matching a name pattern', async () => {
      const techStacks = [mockTechStack];
      jest.spyOn(repository, 'find').mockResolvedValue(techStacks);
      
      const result = await service.findByName('React');
      
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(techStacks);
    });
  });

  describe('findOne', () => {
    it('should return a tech stack by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTechStack);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTechStack);
    });

    it('should throw NotFoundException if tech stack not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tech stack', async () => {
      const updateTechStackDto = {
        name: 'React-Updated',
      };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockTechStack) 
        .mockResolvedValueOnce(null); 
      
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockTechStack,
        name: updateTechStackDto.name,
      });
      
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockTechStack,
        name: updateTechStackDto.name,
      });

      const result = await service.update(1, updateTechStackDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(mockTechStack, updateTechStackDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toEqual(updateTechStackDto.name);
    });

    it('should throw ConflictException if updating to an existing name', async () => {
      const updateTechStackDto = {
        name: 'Angular',
      };

      const existingTechStack = {
        ...mockTechStack,
        id: 2,
        name: 'Angular',
      };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockTechStack) 
        .mockResolvedValueOnce(existingTechStack); 

      await expect(service.update(1, updateTechStackDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if tech stack not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a tech stack', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tech stack not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});