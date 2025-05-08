import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDecompositionController } from './project-decomposition.controller';
import { ProjectDecompositionService } from './project-decomposition.service';

describe('ProjectDecompositionController', () => {
  let controller: ProjectDecompositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDecompositionController],
      providers: [ProjectDecompositionService],
    }).compile();

    controller = module.get<ProjectDecompositionController>(ProjectDecompositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
