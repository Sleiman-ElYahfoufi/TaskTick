import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackingsService } from './time-trackings.service';

describe('TimeTrackingsService', () => {
  let service: TimeTrackingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTrackingsService],
    }).compile();

    service = module.get<TimeTrackingsService>(TimeTrackingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
