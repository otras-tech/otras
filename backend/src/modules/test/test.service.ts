import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TestRepository } from './repository/test.repository';
import { CacheService } from '../../common/cache/cache.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(
    private readonly repository: TestRepository,
    private readonly cacheService: CacheService,
  ) {}

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['tests_all'], ['test_details_*']);
  }

  async create(createTestDto: CreateTestDto) {
    const { name, examId, questionIds: manualQuestionIds } = createTestDto;

    let questionIds: number[] = [];

    if (manualQuestionIds && manualQuestionIds.length > 0) {
      const existing = await this.repository.findQuestionsByIds(manualQuestionIds);

      if (existing.length !== manualQuestionIds.length) {
        const existingIds = existing.map((q) => q.id);
        const missingIds = manualQuestionIds.filter((id) => !existingIds.includes(id));
        throw new BadRequestException(`Some question IDs do not exist: ${missingIds.join(', ')}`);
      }
      questionIds = manualQuestionIds;
    } else {
      const exam = await this.repository.findExamWithSubjects(examId);
      if (!exam) throw new BadRequestException('Exam not found');

      if (!exam.subjects || exam.subjects.length === 0) {
        throw new BadRequestException('This exam has no associated subjects. Please add subjects first.');
      }

      const subjectIds = exam.subjects.map((s) => s.id);
      const questions = await this.repository.findQuestionsBySubjectIds(subjectIds);

      if (questions.length === 0) {
        throw new BadRequestException('No questions found for the subjects associated with this exam.');
      }

      const targetCount = exam.noOfQuestions || 100;
      questionIds = questions
        .sort(() => 0.5 - Math.random())
        .slice(0, targetCount)
        .map((q) => q.id);
    }

    if (questionIds.length === 0) {
      throw new BadRequestException('Cannot create a test with zero questions.');
    }

    const test = await this.repository.createTest({ name, examId }, questionIds);
    await this.invalidateCache();
    return test;
  }

  findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.repository.findAll(cursor, safeTake);
  }

  async findOne(id: number) {
    const test = await this.repository.findById(id);
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async update(id: number, updateTestDto: UpdateTestDto) {
    const test = await this.repository.updateTest(id, {
      name: updateTestDto.name,
      examId: updateTestDto.examId,
    });
    await this.invalidateCache();
    return test;
  }

  async remove(id: number) {
    const test = await this.repository.softDelete(id);
    await this.invalidateCache();
    return test;
  }
}
