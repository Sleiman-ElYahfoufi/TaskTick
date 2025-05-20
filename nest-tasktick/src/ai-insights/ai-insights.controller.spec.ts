import { Test, TestingModule } from '@nestjs/testing';
import { AiInsightsController } from './ai-insights.controller';
import { AiInsightsService } from './ai-insights.service';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import { AiInsight, InsightType } from './entities/ai-insight.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { AiInsightGeneratorService } from './ai-insight-generator/ai-insight-generator.service';

describe('AiInsightsController', () => {
  let controller: AiInsightsController;
  let service: AiInsightsService;

  const mockInsight = {
    id: 1,
    user_id: 1,
    type: InsightType.TIME_ACCURACY,
    description: 'Test insight description',
    created_at: new Date(),
    updated_at: new Date(),
    user: {} as any
  } as AiInsight;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AiInsightsController],
      providers: [
        {
          provide: AiInsightsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            findByType: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        // Add the missing AiInsightGeneratorService mock
        {
          provide: AiInsightGeneratorService,
          useValue: {
            generateInsightsForUser: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<AiInsightsController>(AiInsightsController);
    service = module.get<AiInsightsService>(AiInsightsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new insight', async () => {
      const createInsightDto: CreateAiInsightDto = {
        user_id: 1,
        type: InsightType.TIME_ACCURACY,
        description: 'Test insight description'
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockInsight);

      const result = await controller.create(createInsightDto);

      expect(service.create).toHaveBeenCalledWith(createInsightDto);
      expect(result).toEqual(mockInsight);
    });
  });

  describe('findAll', () => {
    it('should return all insights', async () => {
      const insights = [mockInsight];
      jest.spyOn(service, 'findAll').mockResolvedValue(insights);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(insights);
    });

    it('should find insights by user ID', async () => {
      const insights = [mockInsight];
      jest.spyOn(service, 'findByUserId').mockResolvedValue(insights);

      const result = await controller.findAll('1');

      expect(service.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(insights);
    });

    it('should find insights by type', async () => {
      const insights = [mockInsight];
      jest.spyOn(service, 'findByType').mockResolvedValue(insights);

      const result = await controller.findAll(undefined, InsightType.TIME_ACCURACY);

      expect(service.findByType).toHaveBeenCalledWith(InsightType.TIME_ACCURACY);
      expect(result).toEqual(insights);
    });
  });

  describe('findOne', () => {
    it('should return an insight by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockInsight);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockInsight);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('AI Insight with ID 999 not found')
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an insight', async () => {
      const updateInsightDto: UpdateAiInsightDto = {
        description: 'Updated description',
      };

      const updatedInsight = { ...mockInsight, ...updateInsightDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedInsight);

      const result = await controller.update('1', updateInsightDto);

      expect(service.update).toHaveBeenCalledWith(1, updateInsightDto);
      expect(result).toEqual(updatedInsight);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new NotFoundException('AI Insight with ID 999 not found')
      );

      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an insight', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new NotFoundException('AI Insight with ID 999 not found')
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});