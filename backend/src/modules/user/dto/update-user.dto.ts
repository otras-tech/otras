import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 21 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 'OBC' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Bachelors' })
  @IsOptional()
  @IsString()
  highestDegree?: string;

  @ApiPropertyOptional({ example: 'UPSC' })
  @IsOptional()
  @IsString()
  careerPreference?: string;

  @ApiPropertyOptional({ example: 'Kerala' })
  @IsOptional()
  @IsString()
  domicile?: string;

  @ApiPropertyOptional({ example: '522306' })
  @IsOptional()
  @IsString()
  pincode?: string;
}
