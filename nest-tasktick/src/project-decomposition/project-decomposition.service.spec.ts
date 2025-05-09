import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDecompositionService } from './project-decomposition.service';

describe('ProjectDecompositionService', () => {
  let service: ProjectDecompositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectDecompositionService],
    }).compile();

    service = module.get<ProjectDecompositionService>(ProjectDecompositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
