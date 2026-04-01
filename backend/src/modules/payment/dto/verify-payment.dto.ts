import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({
    example: 'order_9A32NjSdWpX9Sj',
    description: 'The Razorpay Order ID',
  })
  @IsNotEmpty()
  @IsString()
  razorpayOrderId!: string;

  @ApiProperty({
    example: 'pay_9A32NjSdWpX9Sj',
    description: 'The Razorpay Payment ID',
  })
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId!: string;

  @ApiProperty({ example: 'signature', description: 'The Razorpay Signature' })
  @IsNotEmpty()
  @IsString()
  razorpaySignature!: string;
}
