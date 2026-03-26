import { IsString, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EligibilityDto {
  @ApiProperty()
  @IsString()
  exam: string;

  @ApiProperty()
  @IsNumber()
  @Min(16)
  age: number;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  degree: string;

  @ApiProperty()
  @IsBoolean()
  eligible: boolean;

  @ApiProperty()
  @IsString()
  reason: string;
}
