import { Test, TestingModule } from '@nestjs/testing';
import { UserTechStacksService } from './user-tech-stacks.service';

describe('UserTechStacksService', () => {
  let service: UserTechStacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTechStacksService],
    }).compile();

    service = module.get<UserTechStacksService>(UserTechStacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
