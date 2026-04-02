import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from './repository/question.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  create(data: {
    text: string;
    options: string[];
    answer: string;
    explanation?: string;
    subjectId: number;
  }) {
    const { subjectId, ...rest } = data;
    return this.questionRepository.create({
      ...rest,
      subject: { connect: { id: subjectId } },
    });
  }

  findAll(query?: { examId?: number; subjectId?: number }) {
    const where: Prisma.QuestionWhereInput = {};
    if (query?.subjectId) where.subjectId = query.subjectId;
    if (query?.examId) {
      where.tests = { some: { examId: query.examId } };
    }
    return this.questionRepository.findAll(where);
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findById(id);
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  update(
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
    return this.questionRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.questionRepository.softDelete(id);
  }
}
