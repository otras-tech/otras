import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Mathematics', description: 'Name of the subject' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
