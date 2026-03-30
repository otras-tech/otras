import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PypService } from './pyp.service';

@Controller('pyps')
export class PypController {
  constructor(private readonly pypService: PypService) {}

  @Post()
  create(@Body() data: any) {
    return this.pypService.create(data);
  }

  @Get()
  findAll() {
    return this.pypService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.pypService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pypService.remove(+id);
  }
}
