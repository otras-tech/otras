import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.mockTestCategory.create({
      data: createCategoryDto as any,
    });
  }

  findAll() {
    return this.prisma.mockTestCategory.findMany({ take: 100 });
  }

  findOne(id: number) {
    return this.prisma.mockTestCategory.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.mockTestCategory.update({
      where: { id },
      data: updateCategoryDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.mockTestCategory.delete({
      where: { id },
    });
  }
}
