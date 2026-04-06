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
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
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
  @CheckOwnership()
  @ApiOperation({ summary: 'Get user by ID (Self or Admin only)' })
  @ApiResponse({ status: 200, description: 'User record' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Get(':id/dashboard')
  @CheckOwnership()
  @ApiOperation({ summary: 'Get unified dashboard data (Results + Mock Attempts)' })
  @ApiResponse({ status: 200, description: 'Aggregated dashboard statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  async getDashboardData(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getDashboardData(id);
  }

  @Patch(':id')
  @CheckOwnership()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update your profile (Self or Admin only)' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Soft delete a user (Admin only)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Get(':id/tier-status')
  @CheckOwnership()
  @ApiOperation({ summary: 'Get tier status for a user (Self or Admin only)' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  async getTierStatus(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getTierStatus(id);
  }
}

