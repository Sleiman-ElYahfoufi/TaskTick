import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiInsightsService } from './ai-insights.service';
import { AiInsight, InsightType } from './entities/ai-insight.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('AiInsightsService', () => {
  let service: AiInsightsService;
  let repository: Repository<AiInsight>;
  let usersService: UsersService;

  const mockInsight = {
    id: 1,
    user_id: 1,
    type: InsightType.TIME_ACCURACY,
    description: 'Test insight description',
    created_at: new Date(),
    updated_at: new Date(),
    user: {} as any
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiInsightsService,
        {
          provide: getRepositoryToken(AiInsight),
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

    service = module.get<AiInsightsService>(AiInsightsService);
    repository = module.get<Repository<AiInsight>>(getRepositoryToken(AiInsight));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new insight', async () => {
      const createInsightDto = {
        user_id: 1,
        type: InsightType.TIME_ACCURACY,
        description: 'Test insight description'
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'create').mockReturnValue(mockInsight);
      jest.spyOn(repository, 'save').mockResolvedValue(mockInsight);

      const result = await service.create(createInsightDto);

      expect(usersService.findOne).toHaveBeenCalledWith(createInsightDto.user_id);
      expect(repository.create).toHaveBeenCalledWith(createInsightDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockInsight);
    });
  });

  describe('findAll', () => {
    it('should return an array of insights', async () => {
      const insights = [mockInsight];
      jest.spyOn(repository, 'find').mockResolvedValue(insights);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(insights);
    });
  });

  describe('findByUserId', () => {
    it('should return insights for a specific user', async () => {
      const insights = [mockInsight];
      jest.spyOn(repository, 'find').mockResolvedValue(insights);
      
      const result = await service.findByUserId(1);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { user_id: 1 }
      });
      expect(result).toEqual(insights);
    });
  });

  describe('findByType', () => {
    it('should return insights of a specific type', async () => {
      const insights = [mockInsight];
      jest.spyOn(repository, 'find').mockResolvedValue(insights);
      
      const result = await service.findByType(InsightType.TIME_ACCURACY);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: InsightType.TIME_ACCURACY }
      });
      expect(result).toEqual(insights);
    });
  });

  describe('findOne', () => {
    it('should return an insight by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInsight);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockInsight);
    });

    it('should throw NotFoundException if insight not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an insight', async () => {
      const updateInsightDto = {
        description: 'Updated description',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInsight);
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockInsight,
        description: updateInsightDto.description,
      });
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockInsight,
        description: updateInsightDto.description,
      });

      const result = await service.update(1, updateInsightDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(mockInsight, updateInsightDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.description).toEqual(updateInsightDto.description);
    });

    it('should verify user exists when updating user_id', async () => {
      const updateInsightDto = {
        user_id: 2,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInsight);
      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(repository, 'merge').mockReturnValue({
        ...mockInsight,
        user_id: updateInsightDto.user_id,
      });
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockInsight,
        user_id: updateInsightDto.user_id,
      });

      const result = await service.update(1, updateInsightDto);

      expect(usersService.findOne).toHaveBeenCalledWith(updateInsightDto.user_id);
      expect(result.user_id).toEqual(updateInsightDto.user_id);
    });

    it('should throw NotFoundException if insight not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { description: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an insight', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if insight not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});