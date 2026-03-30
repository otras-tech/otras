import { Module } from '@nestjs/common';
import { PypService } from './pyp.service';
import { PypController } from './pyp.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PypService],
  controllers: [PypController]
})
export class PypModule { }

