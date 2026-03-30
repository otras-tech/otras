import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is the capital of France?', description: 'Question text' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: ['London', 'Paris', 'Berlin', 'Madrid'], description: 'List of options' })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ example: 'Paris', description: 'The correct answer' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiPropertyOptional({ example: 'Paris is the capital and largest city of France.', description: 'Brief explanation' })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({ example: 1, description: 'ID of the Subject this question belongs to' })
  @IsNumber()
  @IsNotEmpty()
  subjectId: number;
}
