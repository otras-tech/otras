import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { SubscriptionRepository } from './repository/subscription.repository';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly cacheService: CacheService,
  ) {}

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['subscriptions_all'], ['subscription_details_*']);
  }

  async create(data: CreateSubscriptionDto) {
    const result = await this.subscriptionRepository.create({
      title: data.title,
      price: data.price,
      features: data.features,
      isRecommended: data.isRecommended,
    });
    await this.invalidateCache();
    return result;
  }

  async findAll(cursor?: number, take?: number) {
    return this.subscriptionRepository.findAll(cursor, take);
  }

  async findOne(id: number) {
    const sub = await this.subscriptionRepository.findById(id);
    if (!sub) throw new NotFoundException('Subscription plan not found');
    return sub;
  }

  async update(id: number, data: Partial<CreateSubscriptionDto>) {
    const result = await this.subscriptionRepository.update(id, {
      title: data.title,
      price: data.price,
      features: data.features,
      isRecommended: data.isRecommended,
    });
    await this.invalidateCache();
    await this.cacheService.del(`subscription_details_${id}`);
    return result;
  }

  async remove(id: number) {
    const result = await this.subscriptionRepository.softDelete(id);
    await this.invalidateCache();
    await this.cacheService.del(`subscription_details_${id}`);
    return result;
  }
}
