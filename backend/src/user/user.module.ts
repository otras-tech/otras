import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ResultModule } from '../result/result.module';
import { MockTestModule } from '../mock-test/mock-test.module';

@Module({
  imports: [forwardRef(() => ResultModule), MockTestModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
