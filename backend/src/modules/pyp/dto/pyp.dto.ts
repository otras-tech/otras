import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePypDto {
  @ApiProperty({ example: 2023, description: 'The year of the previous year paper' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'https://example.com/ssc-cgl-2023.pdf', description: 'URL to the PDF file' })
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ example: 1, description: 'ID of the associated exam' })
  @IsNumber()
  @IsNotEmpty()
  examId: number;
}
