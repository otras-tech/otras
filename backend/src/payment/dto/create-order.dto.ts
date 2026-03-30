import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsNotEmpty()
  @IsNumber()
  subscriptionId: number;
}
