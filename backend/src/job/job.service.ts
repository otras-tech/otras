import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
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
