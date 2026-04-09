import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamRepository } from './repository/exam.repository';
import { CacheService } from '../../common/cache/cache.service';
import { CreateExamDto } from './dto/create-exam.dto';

@Injectable()
export class ExamService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly cacheService: CacheService,
  ) { }

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['exams_all'], ['exam_details_*']);
  }


  async create(data: CreateExamDto) {
    const { subjectIds, ...examData } = data;

    const exam = await this.examRepository.create({
      ...examData,
      subjects: {
        connect: (subjectIds || []).map((id: number) => ({ id })),
      },
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
    const key = `exams:${cursor || 0}:${take || 10}`;

    return this.cacheService.getOrSet(
      key,
      async () => {
        console.log("❌ DB HIT:", key); // debug
        return this.examRepository.findAll(cursor, take);
      },
      600 // 10 min TTL
    );
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

    const randomTest =
      exam.tests[Math.floor(Math.random() * exam.tests.length)];

    const { tests, ...examInfo } = exam;

    return { test: randomTest, exam: examInfo };
  }

  // 🔥 FIXED SCALABLE VERSION
  async generateTest(examId: number) {
    const exam = await this.examRepository.findForTestGeneration(examId);

    if (!exam) throw new NotFoundException('Exam not found');

    const subjectIds = exam.subjects.map((s) => s.id);
    const testSize = exam.noOfQuestions || 100;

    // 🔥 SINGLE DB CALL (NO N+1)
    const questionPool =
      await this.examRepository.findAllQuestionIds(subjectIds);

    if (!questionPool || questionPool.length === 0) {
      throw new NotFoundException(
        'No questions available in associated subjects to generate a test',
      );
    }

    // 🔥 Shuffle in-memory (FAST)
    const shuffled = questionPool.sort(() => 0.5 - Math.random());

    const selectedQuestionIds = shuffled
      .slice(0, testSize)
      .map((q) => q.id);

    const newTest = await this.examRepository.createTest({
      name: `${exam.name} Auto-Generated - ${new Date().toLocaleDateString()}`,
      exam: { connect: { id: exam.id } },
      questions: {
        connect: selectedQuestionIds.map((id) => ({ id })),
      },
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