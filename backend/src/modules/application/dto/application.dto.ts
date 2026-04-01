import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'ID of the User applying' })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({ example: 1, description: 'ID of the Exam being applied for' })
  @IsNumber()
  @IsNotEmpty()
  examId!: number;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({
    example: 'Approved',
    description: 'New status for the application',
  })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiPropertyOptional({ example: 'Success' })
  @IsOptional()
  @IsString()
  applicationStatus?: string;

  @ApiPropertyOptional({ example: 'Released' })
  @IsOptional()
  @IsString()
  admitCardStatus?: string;

  @ApiPropertyOptional({ example: 'Pending' })
  @IsOptional()
  @IsString()
  examKeyStatus?: string;

  @ApiPropertyOptional({ example: 'Declared' })
  @IsOptional()
  @IsString()
  resultStatus?: string;
}
