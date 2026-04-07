import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Headers,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaymentService } from './payment.service';
import { Throttle } from '@nestjs/throttler';
import { ScalableThrottlerGuard } from '../../common/guards/scalable-throttler.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(ScalableThrottlerGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('create-order')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a Razorpay order for a subscription' })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only create orders for yourself' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createOrder(
    @Request() req: any,
    @Body() createOrderDto: CreateOrderDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    // Ownership enforced in service
    return this.paymentService.createOrder(req.user.id, createOrderDto, idempotencyKey);
  }

  @Post('verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify a Razorpay payment signature' })
  @ApiResponse({ status: 200, description: 'Payment verified and subscription activated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentService.verifyPayment(verifyPaymentDto, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('pay-with-credits')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Pay for a subscription using user credits' })
  @ApiResponse({ status: 200, description: 'Payment successful with credits' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only use your own credits' })
  payWithCredits(
    @Request() req: any,
    @Body() dto: { subscriptionId: number },
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentService.payWithCredits(req.user.id, req.user.id, dto.subscriptionId, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get payment history for a specific user (Self or Admin) - Paginated' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Payment history' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  getPaymentsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.paymentService.getPaymentsByUser(req.user.id, req.user.role, userId, cursor, take);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @Get()
  @ApiOperation({ summary: 'Get all payments (Admin only) - Paginated' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'All payments' })
  getAllPayments(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.paymentService.getAllPayments(cursor, take);
  }
}
