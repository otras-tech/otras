import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubjectDto {
  @ApiPropertyOptional({ example: 'Quantitative Aptitude' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Core aptitude section' })
  @IsOptional()
  @IsString()
  description?: string;
}
