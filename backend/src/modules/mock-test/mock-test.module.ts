import { Module } from '@nestjs/common';
import { MockTestService } from './mock-test.service';
import { MockTestController } from './mock-test.controller';
import { MockTestRepository } from './repository/mock-test.repository';

@Module({
  controllers: [MockTestController],
  providers: [MockTestService, MockTestRepository],
  exports: [MockTestService],
})
export class MockTestModule {}
