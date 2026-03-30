import { Module, forwardRef } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { UserModule } from '../user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { ResultProcessor } from './result.processor';

import { getQueueToken } from '@nestjs/bullmq';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ...(process.env.DISABLE_REDIS === 'true'
      ? []
      : [
          BullModule.registerQueue({
            name: 'result-calculation',
          }),
        ]),
  ],
  providers: [
    ResultService,
    ResultProcessor,
    ...(process.env.DISABLE_REDIS === 'true'
      ? [
          {
            provide: getQueueToken('result-calculation'),
            useValue: { add: async () => ({ id: 'fake-job-id' }) },
          },
        ]
      : []),
  ],
  controllers: [ResultController],
  exports: [ResultService],
})
export class ResultModule {}
