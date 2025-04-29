import { Test, TestingModule } from '@nestjs/testing';
import { AiInsightsController } from './ai-insights.controller';
import { AiInsightsService } from './ai-insights.service';

describe('AiInsightsController', () => {
  let controller: AiInsightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiInsightsController],
      providers: [AiInsightsService],
    }).compile();

    controller = module.get<AiInsightsController>(AiInsightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
