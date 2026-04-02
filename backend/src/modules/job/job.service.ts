import { Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from './repository/job.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private readonly repository: JobRepository) {}

  async create(data: Prisma.JobCreateInput) {
    return this.repository.create(data);
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.repository.findAll(cursor, safeTake);
  }

  async findOne(id: number) {
    const job = await this.repository.findById(id);
    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
    return job;
  }

  async update(id: number, data: Prisma.JobUpdateInput) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.softDelete(id);
  }
}
