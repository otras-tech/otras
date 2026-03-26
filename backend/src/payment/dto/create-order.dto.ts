import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'User ID requesting the subscription' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: 'Subscription plan ID' })
  @IsNotEmpty()
  @IsNumber()
  subscriptionId: number;
}

export class VerifyPaymentDto {
  @ApiProperty({ example: 'order_9Axyz123' })
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @ApiProperty({ example: 'pay_9Axyz456' })
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @ApiProperty({ example: 'abc123signature...' })
  @IsNotEmpty()
  @IsString()
  razorpaySignature: string;
}
