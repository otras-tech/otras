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
  Query,
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
  async findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.userService.findAll(cursor, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Self or Admin only)' })
  @ApiResponse({ status: 200, description: 'User record' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    // Ownership enforced in service
    return this.userService.findById(id);
  }

  @Get(':id/dashboard')
  @ApiOperation({ summary: 'Get unified dashboard data (Results + Mock Attempts)' })
  @ApiResponse({ status: 200, description: 'Aggregated dashboard statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  async getDashboardData(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.userService.getDashboardData(req.user.id, req.user.role, id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update your profile (Self or Admin only)' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.userService.update(req.user.id, req.user.role, id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Soft delete a user (Admin only)' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.userService.remove(req.user.role, id);
  }

  @Get(':id/tier-status')
  @ApiOperation({ summary: 'Get tier status for a user (Self or Admin only)' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  async getTierStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.userService.getTierStatus(req.user.id, req.user.role, id);
  }
}
