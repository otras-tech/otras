import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateReferralDto } from './dto/referral.dto';

@ApiTags('Referrals')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new referral link between users' })
  @ApiResponse({ status: 201, description: 'Referral created' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only create referrals for yourself' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createReferral(@Body() dto: CreateReferralDto, @Request() req: any) {
    return this.referralService.createReferral(
      req.user.id,
      dto.referrerId,
      dto.refereeOtrId,
    );
  }

  @Get('stats/:referrerId')
  @ApiOperation({ summary: 'Get summary stats of referrals for a user (Self or Admin)' })
  @ApiResponse({ status: 200, description: 'Referral statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  getReferralStats(
    @Param('referrerId', ParseIntPipe) referrerId: number,
    @Request() req: any,
  ) {
    return this.referralService.getReferralStats(req.user.id, req.user.role, referrerId);
  }

  @Get('history/:referrerId')
  @ApiOperation({ summary: 'Get detailed referral history for a user (Self or Admin)' })
  @ApiResponse({ status: 200, description: 'List of referrals made' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  getReferralHistory(
    @Param('referrerId', ParseIntPipe) referrerId: number,
    @Request() req: any,
  ) {
    return this.referralService.getReferralHistory(req.user.id, req.user.role, referrerId);
  }

  @Get('rewards/:userId')
  @ApiOperation({ summary: 'Get pending/earned referral rewards for a user (Self or Admin)' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  getRewards(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    return this.referralService.getRewards(req.user.id, req.user.role, userId);
  }

  @Get('admin/all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all referrals in the system (Admin only)' })
  getAllReferrals() {
    return this.referralService.getAllReferrals();
  }
}
