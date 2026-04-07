import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegisterDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../auth/guards/jwt-refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/types/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ScalableThrottlerGuard } from '../../common/guards/scalable-throttler.guard';

@ApiTags('Admin')
@Controller('admin/auth')
@UseGuards(ScalableThrottlerGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: 201, description: 'Admin registered and logged in' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or Username already exists',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: AdminRegisterDto) {
    return this.adminService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin validated, returns JWT' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: AdminLoginDto) {
    const admin = await this.adminService.validateAdmin(
      dto.email,
      dto.password,
    );
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.adminService.login(admin);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  @ApiOperation({ summary: 'Admin logout' })
  async logout(@CurrentUser() user: RequestUser) {
    const authService = (this.adminService as any).authService;
    return authService.logout(user.id, user.jti!, 'ADMIN');
  }

  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('access-token')
  @Post('refresh')
  @ApiOperation({ summary: 'Admin token refresh' })
  async refresh(@CurrentUser() user: RequestUser) {
    const authService = (this.adminService as any).authService;
    return authService.refreshTokens(user.id, user.refreshToken!, user.jti!, 'ADMIN');
  }
}
