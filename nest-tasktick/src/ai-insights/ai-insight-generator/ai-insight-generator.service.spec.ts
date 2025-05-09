import { Test, TestingModule } from '@nestjs/testing';
import { AiInsightGeneratorService } from './ai-insight-generator.service';

describe('AiInsightGeneratorService', () => {
  let service: AiInsightGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiInsightGeneratorService],
    }).compile();

    service = module.get<AiInsightGeneratorService>(AiInsightGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
