import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth('access-token')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly cacheService: CacheService,
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subscription plan created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('subscriptions_all')
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get all active subscription plans (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of subscription plans' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.subscriptionService.findAll(cursor, take);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  @ApiResponse({ status: 200, description: 'Subscription plan details' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription plan (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription plan updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateSubscriptionDto>,
  ) {
    return this.subscriptionService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription plan (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription plan deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.remove(id);
  }
}
