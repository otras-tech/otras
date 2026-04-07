import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { QuestionRepository } from './repository/question.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly cacheService: CacheService,
  ) {}

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['questions_all'], ['question_details_*']);
  }

  async create(data: {
    text: string;
    options: string[];
    answer: string;
    explanation?: string;
    subjectId: number;
  }) {
    const { subjectId, ...rest } = data;
    const result = await this.questionRepository.create({
      ...rest,
      subject: { connect: { id: subjectId } },
    });
    await this.invalidateCache();
    return result;
  }

  findAll(query?: { examId?: number; subjectId?: number; cursor?: number; take?: number }) {
    const where: Prisma.QuestionWhereInput = {};
    if (query?.subjectId) where.subjectId = query.subjectId;
    if (query?.examId) {
      where.tests = { some: { examId: query.examId } };
    }
    return this.questionRepository.findAll(where, query?.cursor, query?.take);
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findById(id);
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(
    id: number,
    data: {
      text?: string;
      options?: string[];
      answer?: string;
      explanation?: string;
      subjectId?: number;
    },
  ) {
    const { subjectId, ...rest } = data;
    const updateData: Prisma.QuestionUpdateInput = { ...rest };
    if (subjectId) {
      updateData.subject = { connect: { id: subjectId } };
    }
    const result = await this.questionRepository.update(id, updateData);
    await this.invalidateCache();
    await this.cacheService.del(`question_details_${id}`);
    return result;
  }

  async remove(id: number) {
    const result = await this.questionRepository.softDelete(id);
    await this.invalidateCache();
    await this.cacheService.del(`question_details_${id}`);
    return result;
  }
}
