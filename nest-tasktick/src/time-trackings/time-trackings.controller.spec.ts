import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackingsController } from './time-trackings.controller';
import { TimeTrackingsService } from './time-trackings.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';


describe('TimeTrackingsController', () => {
  let controller: TimeTrackingsController;
  let service: TimeTrackingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [TimeTrackingsController],
      providers: [
        {
          provide: TimeTrackingsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllByUserId: jest.fn(),
            findAllByTaskId: jest.fn(),
            findByDateRange: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            startTracking: jest.fn(),
            stopTracking: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TimeTrackingsController>(TimeTrackingsController);
    service = module.get<TimeTrackingsService>(TimeTrackingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


});