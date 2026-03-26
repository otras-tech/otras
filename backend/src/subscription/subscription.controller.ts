import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe, Patch, Delete } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subscription plan created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active subscription plans' })
  @ApiResponse({ status: 200, description: 'List of subscription plans' })
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  @ApiResponse({ status: 200, description: 'Subscription plan details' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription plan (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription plan updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateSubscriptionDto>) {
    return this.subscriptionService.update(id, data);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription plan (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription plan deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.remove(id);
  }
}
