import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { ReferralRepository } from './repository/referral.repository';

@Module({
  controllers: [ReferralController],
  providers: [ReferralService, ReferralRepository],
})
export class ReferralModule {}
