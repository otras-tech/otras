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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { PypService } from './pyp.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreatePypDto } from './dto/pyp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Previous Year Papers (PYP)')
@Controller('pyps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PypController {
  constructor(
    private readonly pypService: PypService,
    private readonly cacheService: CacheService,
  ) { }

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
  @UseInterceptors(CacheInterceptor)
  @CacheKey('pyps_all')
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get all PYP entries (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of PYP entries' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.pypService.findAll(cursor, take);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get PYP entry by ID' })
  @ApiResponse({ status: 200, description: 'PYP entry details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pypService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a PYP entry' })
  @ApiResponse({ status: 200, description: 'PYP entry updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePypDto>,
  ) {
    const result = await this.pypService.update(id, data);
    await this.cacheService.del(`pyp_details_${id}`);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a PYP entry' })
  @ApiResponse({ status: 200, description: 'PYP entry deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.pypService.remove(id);
    await this.cacheService.del(`pyp_details_${id}`);
    return result;
  }
}
