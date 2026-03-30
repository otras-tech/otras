import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Backend Engineer', description: 'The title of the job' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'We are looking for a Node.js expert...', description: 'Full job description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-12-31T23:59:59Z', description: 'Application deadline' })
  @IsDateString()
  @IsNotEmpty()
  deadline: string | Date;

  @ApiPropertyOptional({ example: 'Open', enum: ['Open', 'Closed', 'Paused'] })
  @IsOptional()
  @IsString()
  status?: string;
}
