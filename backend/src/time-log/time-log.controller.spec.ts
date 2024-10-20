import { Test, TestingModule } from '@nestjs/testing';
import { TimeLogController } from './time-log.controller';
import { TimeLogService } from './time-log.service';

describe('TimeLogController', () => {
  let controller: TimeLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeLogController],
      providers: [TimeLogService],
    }).compile();

    controller = module.get<TimeLogController>(TimeLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
