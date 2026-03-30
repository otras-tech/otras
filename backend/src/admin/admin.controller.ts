import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService, Tokens } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('admin/auth')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    const admin = await this.adminService.register(body);
    return this.authService.login(admin, true);
  }

  @Post('login')
  async login(@Body() body: any) {
    const admin = await this.adminService.validateAdmin(
      body.email,
      body.password,
    );
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(admin, true);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.authService.logout(userId, true);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = (req.user as any).sub;
    const refreshToken = (req.user as any).refreshToken;
    return this.authService.refreshTokens(userId, refreshToken, true);
  }
}
