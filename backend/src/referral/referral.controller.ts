import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReferralDto } from './dto/referral.dto';

@ApiTags('Referrals')
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new referral link between users' })
  @ApiResponse({ status: 201, description: 'Referral created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createReferral(@Body() dto: CreateReferralDto) {
    return this.referralService.createReferral(dto.referrerId, dto.refereeOtrId);
  }

  @Get('stats/:referrerId')
  @ApiOperation({ summary: 'Get summary stats of referrals for a user' })
  @ApiResponse({ status: 200, description: 'Referral statistics' })
  getReferralStats(@Param('referrerId', ParseIntPipe) referrerId: number) {
    return this.referralService.getReferralStats(referrerId);
  }

  @Get('history/:referrerId')
  @ApiOperation({ summary: 'Get detailed referral history for a user' })
  @ApiResponse({ status: 200, description: 'List of referrals made' })
  getReferralHistory(@Param('referrerId', ParseIntPipe) referrerId: number) {
    return this.referralService.getReferralHistory(referrerId);
  }

  @Get('rewards/:userId')
  @ApiOperation({ summary: 'Get pending/earned referral rewards for a user' })
  getRewards(@Param('userId', ParseIntPipe) userId: number) {
    return this.referralService.getRewards(userId);
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Get all referrals in the system (Admin)' })
  getAllReferrals() {
    return this.referralService.getAllReferrals();
  }
}
