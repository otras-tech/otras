import {
  IsString,
  IsNumber,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class AiRequestDto {
  @IsString()
  @IsNotEmpty()
  exam: string;

  @IsNumber()
  score: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  weakAreas: string[];

  @IsString()
  @IsIn(['en', 'hi', 'te'])
  language: 'en' | 'hi' | 'te';
}
