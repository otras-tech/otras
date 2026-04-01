import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'State PSC',
    description: 'Name of the mock test category',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
