import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.JobCreateInput) {
    return this.prisma.job.create({ data });
  }

  async findAll() {
    return this.prisma.job.findMany({
      where: { status: 'Open' },
      orderBy: { deadline: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.job.findUnique({ where: { id } });
  }
}
