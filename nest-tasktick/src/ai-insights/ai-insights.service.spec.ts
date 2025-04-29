import { Test, TestingModule } from '@nestjs/testing';
import { AiInsightsService } from './ai-insights.service';

describe('AiInsightsService', () => {
  let service: AiInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiInsightsService],
    }).compile();

    service = module.get<AiInsightsService>(AiInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
