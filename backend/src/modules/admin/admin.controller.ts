import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminLoginDto, AdminRegisterDto } from './dto/admin.dto';

@ApiTags('Admin')
@Controller('admin/auth')
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
}
