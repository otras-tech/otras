import { Module } from '@nestjs/common';
import { PypService } from './pyp.service';
import { PypController } from './pyp.controller';
import { PypRepository } from './repository/pyp.repository';

@Module({
  providers: [PypService, PypRepository],
  controllers: [PypController],
})
export class PypModule {}
