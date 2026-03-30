import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

import { IsNumber, IsNotEmpty } from 'class-validator';

class PayWithCreditsDto {
  @IsNumber()
  @IsNotEmpty()
  subscriptionId: number = 0;
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    // Override userId from JWT token so it always refers to the authenticated user
    dto.userId = req.user.id;
    return this.paymentService.createOrder(dto);
  }

  @Post('verify')
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pay-with-credits')
  payWithCredits(@Request() req, @Body() dto: PayWithCreditsDto) {
    return this.paymentService.payWithCredits(req.user.id, dto.subscriptionId);
  }

  @Get('user/:userId')
  getPaymentsByUser(@Param('userId') userId: string) {
    return this.paymentService.getPaymentsByUser(+userId);
  }

  @Get()
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }
}
