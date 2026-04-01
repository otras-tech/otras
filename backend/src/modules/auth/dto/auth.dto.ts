import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address or OTR ID',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ example: 'OTR123456' })
  @IsOptional()
  @IsString()
  otrId?: string;

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
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({ example: 'REF123456' })
  @IsOptional()
  @IsString()
  referralCode?: string;
}
