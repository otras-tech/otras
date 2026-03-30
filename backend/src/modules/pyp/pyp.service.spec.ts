import { Test, TestingModule } from '@nestjs/testing';
import { PypService } from './pyp.service';

describe('PypService', () => {
  let service: PypService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PypService],
    }).compile();

    service = module.get<PypService>(PypService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
