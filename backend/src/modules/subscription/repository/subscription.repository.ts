import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SubscriptionCreateInput) {
    return this.prisma.subscription.create({ data });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.subscription.findMany({
      where: { isDeleted: false },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.subscription.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.SubscriptionUpdateInput) {
    return this.prisma.subscription.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return this.prisma.subscription.update({ where: { id }, data: { isDeleted: true } });
  }
}
