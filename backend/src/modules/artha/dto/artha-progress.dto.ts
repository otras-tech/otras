import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArthaProgressDto {
  @ApiProperty({ example: 'OTR123456', description: 'User OTR ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 85.5 })
  @IsNumber()
  logicalScore: number;

  @ApiProperty({ example: 78.0 })
  @IsNumber()
  quantScore: number;

  @ApiProperty({ example: 92.0 })
  @IsNumber()
  verbalScore: number;

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  totalQuestions?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  attemptedCount?: number;
}