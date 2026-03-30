import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Req() req: Request) {
    return this.authService.logout((req.user as any).id);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = (req.user as any).sub;
    const refreshToken = (req.user as any).refreshToken;
    const role = (req.user as any).role;
    return this.authService.refreshTokens(
      userId,
      refreshToken,
      role === 'ADMIN',
    );
  }
}
