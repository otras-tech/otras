import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { PypRepository } from './repository/pyp.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PypService {
  constructor(
    private readonly pypRepository: PypRepository,
    private readonly cacheService: CacheService,
  ) { }

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['pyps_all'], ['pyp_details_*']);
  }

  async create(data: { year: number; fileUrl: string; examId: number }) {
    const { examId, ...rest } = data;
    const result = await this.pypRepository.create({
      ...rest,
      exam: { connect: { id: examId } },
    });
    await this.invalidateCache();
    return result;
  }

  async findAll(cursor?: number, take?: number) {
    return this.pypRepository.findAll(cursor, take);
  }

  async findOne(id: number) {
    const pyp = await this.pypRepository.findById(id);
    if (!pyp) throw new NotFoundException(`PYP with ID ${id} not found`);
    return pyp;
  }

  async update(
    id: number,
    data: { year?: number; fileUrl?: string; examId?: number },
  ) {
    const { examId, ...rest } = data;
    const updateData: Prisma.PYPUpdateInput = { ...rest };
    if (examId) {
      updateData.exam = { connect: { id: examId } };
    }
    const result = await this.pypRepository.update(id, updateData);
    await this.invalidateCache();
    await this.cacheService.del(`pyp_details_${id}`);
    return result;
  }

  async remove(id: number) {
    const result = await this.pypRepository.softDelete(id);
    await this.invalidateCache();
    await this.cacheService.del(`pyp_details_${id}`);
    return result;
  }
}
