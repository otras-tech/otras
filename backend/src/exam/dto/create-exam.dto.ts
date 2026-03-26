import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 'SSC CGL 2024', description: 'Name of the examination' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 120.5, description: 'Expected cutoff marks' })
  @IsNumber()
  @IsOptional()
  cutoff?: number;

  @ApiPropertyOptional({ example: 'Arithmetic, Algebra, Geometry...', description: 'Brief syllabus summary' })
  @IsString()
  @IsOptional()
  syllabus?: string;

  @ApiPropertyOptional({ example: 'Graduation in any discipline', description: 'Eligibility criteria' })
  @IsString()
  @IsOptional()
  eligibility?: string;

  @ApiPropertyOptional({ example: '100 Questions, 60 Minutes', description: 'Exam pattern details' })
  @IsString()
  @IsOptional()
  pattern?: string;

  @ApiPropertyOptional({ example: 'Short summary for listing' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Detailed description for exam page' })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber()
  @IsOptional()
  noOfQuestions?: number;

  @ApiPropertyOptional({ example: [1, 2], description: 'List of Subject IDs to associate' })
  @IsOptional()
  @IsNumber({}, { each: true })
  subjectIds?: number[];
}
