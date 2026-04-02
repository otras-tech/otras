import { Injectable, NotFoundException } from '@nestjs/common';
import { PypRepository } from './repository/pyp.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PypService {
  constructor(private readonly pypRepository: PypRepository) {}

  async create(data: { year: number; fileUrl: string; examId: number }) {
    const { examId, ...rest } = data;
    return this.pypRepository.create({
      ...rest,
      exam: { connect: { id: examId } },
    });
  }

  async findAll() {
    return this.pypRepository.findAll();
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
    return this.pypRepository.update(id, updateData);
  }

  async remove(id: number) {
    return this.pypRepository.softDelete(id);
  }
}
