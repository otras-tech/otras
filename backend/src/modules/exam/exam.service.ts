import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExamRepository } from './repository/exam.repository';
import { CacheService } from '../../common/cache/cache.service';
import { CreateExamDto } from './dto/create-exam.dto';

@Injectable()
export class ExamService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly cacheService: CacheService,
  ) {}

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['exams_all'], ['exam_details_*']);
  }

  async create(data: CreateExamDto) {
    const { subjectIds, ...examData } = data;
    const targetSubjects = subjectIds || [];

    const exam = await this.examRepository.create({
      ...examData,
      subjects: { connect: targetSubjects.map((id: number) => ({ id })) },
    });
    await this.invalidateCache();
    return exam;
  }

  async update(id: number, updateData: CreateExamDto) {
    const { subjectIds, ...data } = updateData;

    const updateInput: any = { ...data };
    if (subjectIds) {
      updateInput.subjects = {
        set: [],
        connect: subjectIds.map((id: number) => ({ id })),
      };
    }

    const exam = await this.examRepository.update(id, updateInput);
    await this.invalidateCache();
    return exam;
  }

  async findAll(cursor?: number, take?: number) {
    return this.examRepository.findAll(cursor, take);
  }

  async findOne(id: number) {
    return this.examRepository.findById(id);
  }

  async getTest(examId: number) {
    const exam = await this.examRepository.findWithTests(examId);
    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.tests.length === 0) {
      throw new NotFoundException(
        'No tests found for this exam. Use POST to generate one.',
      );
    }

    const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];
    const { tests, ...examInfo } = exam;
    return { test: randomTest, exam: examInfo };
  }

  async generateTest(examId: number) {
    const exam = await this.examRepository.findForTestGeneration(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    const subjectIds = exam.subjects.map((s) => s.id);
    const totalQuestions = await this.examRepository.countQuestions(subjectIds);

    if (totalQuestions === 0) {
      throw new NotFoundException(
        'No questions available in associated subjects to generate a test',
      );
    }

    const testSize = exam.noOfQuestions || 100;
    const selectedQuestionIds: number[] = [];
    const usedOffsets = new Set<number>();

    if (testSize > totalQuestions / 2) {
      const allQs = await this.examRepository.findAllQuestionIds(subjectIds);
      selectedQuestionIds.push(
        ...allQs
          .sort(() => 0.5 - Math.random())
          .slice(0, testSize)
          .map((q) => q.id),
      );
    } else {
      while (
        selectedQuestionIds.length < testSize &&
        usedOffsets.size < totalQuestions
      ) {
        const randomOffset = Math.floor(Math.random() * totalQuestions);
        if (!usedOffsets.has(randomOffset)) {
          usedOffsets.add(randomOffset);
          const [question] = await this.examRepository.findQuestionAtOffset(
            subjectIds,
            randomOffset,
          );
          if (question) selectedQuestionIds.push(question.id);
        }
      }
    }

    const newTest = await this.examRepository.createTest({
      name: `${exam.name} Auto-Generated - ${new Date().toLocaleDateString()}`,
      exam: { connect: { id: exam.id } },
      questions: { connect: selectedQuestionIds.map((id) => ({ id })) },
    });

    return { test: newTest, exam };
  }

  async findByTier(tier: string) {
    return this.examRepository.findByTier(tier);
  }

  async remove(id: number) {
    const exam = await this.examRepository.softDelete(id);
    await this.invalidateCache();
    return exam;
  }
}
