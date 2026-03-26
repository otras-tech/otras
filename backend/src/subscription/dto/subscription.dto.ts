import { IsString, IsNotEmpty, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'Pro Monthly Plan', description: 'Title of the subscription plan' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 499, description: 'Price in INR' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: ['Unlimited Mock Tests', 'AI Career Roadmap', 'Ad-free Experience'], description: 'List of features' })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({ example: true, description: 'Whether this plan is highlighted as recommended' })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}
