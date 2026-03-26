import { IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CareerDto {
  @ApiProperty()
  @IsString()
  stream: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  logicalScore: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  quantScore: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  communicationScore: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  interestAlignmentScore: number;
}
