import { IsString, IsNotEmpty, IsArray, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CareerReadinessAnswerDto {
  @ApiProperty({ example: 45, description: 'Question ID' })
  @IsNumber()
  questionId: number;

  @ApiProperty({ example: 'B', description: 'Selected option' })
  @IsString()
  selectedOption: string;

  @ApiProperty({ example: 30, description: 'Time taken in seconds' })
  @IsNumber()
  timeTaken: number;
}

export class SubmitCareerReadinessDto {
  @ApiProperty({ example: 'OTR123456', description: 'User OTR ID' })
  @IsString()
  @IsNotEmpty()
  otrId: string;

  @ApiProperty({ example: 1, description: 'ID of the Career Readiness test' })
  @IsNumber()
  @IsNotEmpty()
  testId: number;

  @ApiProperty({ type: [CareerReadinessAnswerDto], description: 'List of question attempts' })
  @IsArray()
  @IsObject({ each: true })
  answers: CareerReadinessAnswerDto[];
}
