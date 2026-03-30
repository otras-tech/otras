import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { IsNumber, IsNotEmpty } from 'class-validator';

class CreateApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  examId: number;
}

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() body: CreateApplicationDto) {
    return this.applicationService.create(body.userId, body.examId);
  }

  @Get('user/otr/:otrId')
  findByOtrId(@Param('otrId') otrId: string) {
    return this.applicationService.findByOtrId(otrId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.applicationService.findByUser(+userId);
  }

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() statusData: any) {
    return this.applicationService.updateStatus(+id, statusData);
  }
}
