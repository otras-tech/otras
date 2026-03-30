import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

class CreateReferralDto {
  @IsNumber()
  @IsNotEmpty()
  referrerId: number = 0;

  @IsString()
  @IsNotEmpty()
  refereeOtrId: string = '';
}

@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  createReferral(@Body() body: CreateReferralDto) {
    return this.referralService.createReferral(
      body.referrerId,
      body.refereeOtrId,
    );
  }

  @Get('stats/:referrerId')
  getReferralStats(@Param('referrerId') referrerId: string) {
    return this.referralService.getReferralStats(+referrerId);
  }

  @Get('history/:referrerId')
  getReferralHistory(@Param('referrerId') referrerId: string) {
    return this.referralService.getReferralHistory(+referrerId);
  }

  @Get('rewards/:userId')
  getRewards(@Param('userId') userId: string) {
    return this.referralService.getRewards(+userId);
  }

  @Get('admin/all')
  getAllReferrals() {
    return this.referralService.getAllReferrals();
  }
}
