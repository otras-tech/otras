import { Controller, Post, Get, Body, Param, UseGuards, Request, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('create-order')
  @ApiOperation({ summary: 'Create a Razorpay order for a subscription' })
  @ApiResponse({ status: 201, description: 'Order created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    // Override userId from JWT token so it always refers to the authenticated user
    createOrderDto.userId = req.user.id;
    return this.paymentService.createOrder(createOrderDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a Razorpay payment signature' })
  @ApiResponse({ status: 200, description: 'Payment verified and subscription activated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(verifyPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('pay-with-credits')
  @ApiOperation({ summary: 'Pay for a subscription using user credits' })
  @ApiResponse({ status: 200, description: 'Payment successful with credits' })
  payWithCredits(@Request() req, @Body() dto: { subscriptionId: number }) {
    return this.paymentService.payWithCredits(req.user.id, dto.subscriptionId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('user/:userId')
  getPaymentsByUser(@Param('userId') userId: string) {
    return this.paymentService.getPaymentsByUser(+userId);
  }

  @Get()
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }
}
