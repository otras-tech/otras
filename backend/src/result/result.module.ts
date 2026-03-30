import { Module, forwardRef } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [ResultService],
  controllers: [ResultController],
  exports: [ResultService],
})
export class ResultModule {}
