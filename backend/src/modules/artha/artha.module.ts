import { Module } from '@nestjs/common';
import { ArthaController } from './artha.controller';
import { ArthaService } from './artha.service';
import { ArthaRepository } from './repository/artha.repository';
import { PrismaModule } from '../../database/prisma.module';
import { Tier3MetricsService } from './tier3-metrics.service';
import { ArthaProcessor } from './processor/artha.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule,
    ...(process.env.DISABLE_REDIS === 'true'
      ? []
      : [
          BullModule.registerQueue({
            name: 'artha',
          }),
        ]),
  ],
  controllers: [ArthaController],
  providers: [
    ArthaService,
    ArthaRepository,
    Tier3MetricsService,
    ArthaProcessor,
    ...(process.env.DISABLE_REDIS === 'true'
      ? [
          {
            provide: 'BullQueue_artha',
            useValue: { add: async () => ({ id: 'fake-artha-job-id' }) },
          },
        ]
      : []),
  ],
  exports: [ArthaService],
})
export class ArthaModule {}
