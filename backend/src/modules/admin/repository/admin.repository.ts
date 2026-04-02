import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AdminRegisterDto } from '../dto/admin.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AdminCreateInput) {
    return this.prisma.admin.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: { email, isDeleted: false },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.admin.findUnique({
      where: { username, isDeleted: false },
    });
  }

  async findById(id: number) {
    return this.prisma.admin.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async softDelete(id: number) {
    return this.prisma.admin.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
