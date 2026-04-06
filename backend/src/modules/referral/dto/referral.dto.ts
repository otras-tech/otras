import { IsString, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty({ example: 1, description: 'ID of the user who is referring' })
  @IsNumber()
  @IsNotEmpty()
  referrerId!: number;

  @ApiProperty({
    example: 'OTR123456',
    description: 'OTR ID of the user being referred',
  })
  @IsString()
  @IsNotEmpty()
  refereeOtrId!: string;
}

export class GetReferralHistoryDto {
  @ApiPropertyOptional({ example: 123, description: 'Cursor for pagination' })
  @IsNumber()
  @IsOptional()
  cursor?: number;

  @ApiPropertyOptional({ example: 20, description: 'Number of items to fetch' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  take?: number;
}
