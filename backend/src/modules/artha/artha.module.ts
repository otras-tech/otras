import { Module } from '@nestjs/common';
import { ArthaController } from './artha.controller';
import { ArthaService } from './artha.service';
import { ArthaRepository } from './repository/artha.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { Tier3MetricsService } from './tier3-metrics.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArthaController],
  providers: [ArthaService, ArthaRepository, Tier3MetricsService],
  exports: [ArthaService],
})
export class ArthaModule {}
