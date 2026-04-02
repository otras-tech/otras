import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { ResultModule } from '../result/result.module';
import { MockTestModule } from '../mock-test/mock-test.module';

@Module({
  imports: [forwardRef(() => ResultModule), MockTestModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
