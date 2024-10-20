import { Test, TestingModule } from '@nestjs/testing';
import { GeolocService } from './geoloc.service';

describe('GeolocService', () => {
  let service: GeolocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocService],
    }).compile();

    service = module.get<GeolocService>(GeolocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
