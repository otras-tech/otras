import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from './repository/subscription.repository';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async create(data: CreateSubscriptionDto) {
    return this.subscriptionRepository.create({
      title: data.title,
      price: data.price,
      features: data.features,
      isRecommended: data.isRecommended,
    });
  }

  async findAll() {
    return this.subscriptionRepository.findAll();
  }

  async findOne(id: number) {
    const sub = await this.subscriptionRepository.findById(id);
    if (!sub) throw new NotFoundException('Subscription plan not found');
    return sub;
  }

  async update(id: number, data: Partial<CreateSubscriptionDto>) {
    return this.subscriptionRepository.update(id, {
      title: data.title,
      price: data.price,
      features: data.features,
      isRecommended: data.isRecommended,
    });
  }

  async remove(id: number) {
    return this.subscriptionRepository.softDelete(id);
  }
}
