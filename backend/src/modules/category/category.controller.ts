import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Mock Tests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cacheService: CacheService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new mock test category (Admin only)' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Roles('USER', 'ADMIN') // Allow both roles to view
  @UseInterceptors(CacheInterceptor)
  @CacheKey('categories_all')
  @CacheTTL(3600) // 1 hour (Very static)
  @ApiOperation({ summary: 'Get all mock test categories (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.categoryService.findAll(cursor, take);
  }

  @Get(':id')
  @Roles('USER', 'ADMIN') // Allow both roles to view
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category details' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category (Admin only)' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const result = await this.categoryService.update(id, updateCategoryDto);
    await this.cacheService.del(`category_details_${id}`);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (Admin only)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.remove(id);
    await this.cacheService.del(`category_details_${id}`);
    return result;
  }
}
