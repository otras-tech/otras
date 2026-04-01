import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        title: data.title,
        price: data.price,
        features: data.features,
        isRecommended: data.isRecommended,
      },
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany({ take: 50 });
  }

  async findOne(id: number) {
    return this.prisma.subscription.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<CreateSubscriptionDto>) {
    return this.prisma.subscription.update({
      where: { id },
      data: {
        title: data.title,
        price: data.price,
        features: data.features,
        isRecommended: data.isRecommended,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.subscription.delete({ where: { id } });
  }
}
