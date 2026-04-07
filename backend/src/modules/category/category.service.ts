import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { CategoryRepository } from './repository/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly cacheService: CacheService,
  ) { }

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['categories_all'], ['category_details_*']);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryRepository.create(createCategoryDto.name);
    await this.invalidateCache();
    return result;
  }

  async findAll(cursor?: number, take?: number) {
    return this.categoryRepository.findAll(cursor, take);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoryRepository.update(id, updateCategoryDto.name!);
    await this.invalidateCache();
    await this.cacheService.del(`category_details_${id}`);
    return result;
  }

  async remove(id: number) {
    const result = await this.categoryRepository.softDelete(id);
    await this.invalidateCache();
    await this.cacheService.del(`category_details_${id}`);
    return result;
  }
}
