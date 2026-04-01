import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Find all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Self or Admin only)' })
  @ApiResponse({ status: 200, description: 'User record' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    if (req.user.id !== id && req.user.role.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.findById(id);
  }

  @Get(':id/dashboard')
  @ApiOperation({
    summary: 'Get unified dashboard data (Results + Mock Attempts)',
  })
  @ApiResponse({ status: 200, description: 'Aggregated dashboard statistics' })
  async getDashboardData(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    if (req.user.id !== id && req.user.role.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.getDashboardData(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update your profile' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @Request() req: any,
  ) {
    if (req.user.id !== id && req.user.role.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN') // Usually only Admins can delete users
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Get(':id/tier-status')
  async getTierStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    if (req.user.id !== id && req.user.role.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.getTierStatus(id);
  }
}
