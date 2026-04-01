import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CleanupService],
})
export class CleanupModule {}
