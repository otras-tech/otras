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
  UseGuards,
} from '@nestjs/common';
import { PypService } from './pyp.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePypDto } from './dto/pyp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Previous Year Papers (PYP)')
@Controller('pyps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PypController {
  constructor(private readonly pypService: PypService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
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
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
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
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a PYP entry' })
  @ApiResponse({ status: 200, description: 'PYP entry deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pypService.remove(id);
  }
}
