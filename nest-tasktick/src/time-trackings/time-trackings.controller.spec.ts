import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackingsController } from './time-trackings.controller';
import { TimeTrackingsService } from './time-trackings.service';

describe('TimeTrackingsController', () => {
  let controller: TimeTrackingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeTrackingsController],
      providers: [TimeTrackingsService],
    }).compile();

    controller = module.get<TimeTrackingsController>(TimeTrackingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
