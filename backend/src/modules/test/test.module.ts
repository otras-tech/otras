import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestRepository } from './repository/test.repository';

@Module({
  controllers: [TestController],
  providers: [TestService, TestRepository],
  exports: [TestRepository],
})
export class TestModule {}
