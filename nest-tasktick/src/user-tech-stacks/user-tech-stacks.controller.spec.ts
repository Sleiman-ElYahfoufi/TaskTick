import { Test, TestingModule } from '@nestjs/testing';
import { UserTechStacksController } from './user-tech-stacks.controller';
import { UserTechStacksService } from './user-tech-stacks.service';

describe('UserTechStacksController', () => {
  let controller: UserTechStacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTechStacksController],
      providers: [UserTechStacksService],
    }).compile();

    controller = module.get<UserTechStacksController>(UserTechStacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
