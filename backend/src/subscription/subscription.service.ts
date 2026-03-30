import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.subscription.create({ data });
  }

  async findAll() {
    return this.prisma.subscription.findMany({ take: 50 });
  }

  async update(id: number, data: any) {
    return this.prisma.subscription.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.subscription.delete({ where: { id } });
  }
}
