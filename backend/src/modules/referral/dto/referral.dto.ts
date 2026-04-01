import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
