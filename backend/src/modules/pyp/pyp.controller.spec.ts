import { Test, TestingModule } from '@nestjs/testing';
import { PypController } from './pyp.controller';

describe('PypController', () => {
  let controller: PypController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PypController],
    }).compile();

    controller = module.get<PypController>(PypController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
