import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SubscriptionCreateInput) {
    return this.prisma.subscription.create({ data });
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      where: { isDeleted: false },
      take: 50,
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
