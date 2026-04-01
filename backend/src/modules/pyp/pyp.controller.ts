import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PypService } from './pyp.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePypDto } from './dto/pyp.dto';

@ApiTags('Previous Year Papers (PYP)')
@Controller('pyps')
export class PypController {
  constructor(private readonly pypService: PypService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PYP entry' })
  @ApiResponse({ status: 201, description: 'PYP entry created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() data: CreatePypDto) {
    return this.pypService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PYP entries' })
  @ApiResponse({ status: 200, description: 'List of PYP entries' })
  findAll() {
    return this.pypService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PYP entry' })
  @ApiResponse({ status: 200, description: 'PYP entry updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePypDto>,
  ) {
    return this.pypService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PYP entry' })
  @ApiResponse({ status: 200, description: 'PYP entry deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pypService.remove(id);
  }
}
