import { IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BurnoutDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(24)
  studyHours: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(10)
  stressLevel: number;

  @ApiProperty({
    example: 'Improving | Stable | Declining | Fluctuating',
  })
  @IsString()
  performanceTrend: string;

  @ApiProperty({
    example: 'Low | Moderate | High',
  })
  @IsString()
  burnoutRisk: string;
}
