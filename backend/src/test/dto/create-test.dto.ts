import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsNumber()
  @IsNotEmpty()
  examId: number = 0;
}
