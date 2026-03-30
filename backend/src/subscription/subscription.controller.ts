import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() data: any) {
    return this.subscriptionService.create(data);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.subscriptionService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }
}
