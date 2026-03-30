import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ArthaProgressDto {
  @IsString()
  userId: string = '';

  @IsNumber()
  logicalScore: number = 0;

  @IsNumber()
  quantScore: number = 0;

  @IsNumber()
  verbalScore: number = 0;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @IsOptional()
  totalQuestions?: number;

  @IsNumber()
  @IsOptional()
  attemptedCount?: number;
}
