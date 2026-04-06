import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminRepository } from './repository/admin.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
  ],
  providers: [AdminService, AdminRepository],
  controllers: [AdminController],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
