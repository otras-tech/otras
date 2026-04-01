import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestDto {
  @ApiProperty({
    example: 'Quantitative Aptitude Tier-1',
    description: 'Name of the test',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1, description: 'ID of the associated Exam' })
  @IsNumber()
  @IsNotEmpty()
  examId!: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Optional list of manual Question IDs',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  questionIds?: number[];
}
