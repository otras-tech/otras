import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateStudyPlanDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsOptional()
  examId?: number;

  @IsString()
  @IsNotEmpty()
  targetExam: string;

  @IsDateString()
  @IsNotEmpty()
  examDate: string;

  @IsInt()
  @IsOptional()
  tier1Score?: number;

  @IsInt()
  @IsOptional()
  tier2Score?: number;

  @IsString()
  @IsNotEmpty()
  currentLevel: string;

  @IsArray()
  @IsString({ each: true })
  weakAreas: string[];

  @IsInt()
  @IsNotEmpty()
  dailyStudyHours: number;

  @IsString()
  @IsNotEmpty()
  mockFrequency: string;

  @IsString()
  @IsNotEmpty()
  revisionStrategy: string;

  @IsString()
  @IsNotEmpty()
  preferredStudyTimes: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsInt()
  @IsOptional()
  planDurationDays?: number;
}
