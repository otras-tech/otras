import { Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { CareerReadinessRepository } from './repository/career-readiness.repository';
import { SubjectBreakdown } from '../../common/types/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerReadinessService {
  private readonly logger = new Logger(CareerReadinessService.name);

  constructor(private readonly repository: CareerReadinessRepository) {}

  async saveResult(requesterOtrId: string, data: {
    otrId: string;
    testId: number | string;
    answers: { questionId: number | string; selectedOption: string }[];
  }) {
    if (requesterOtrId !== data.otrId) {
      throw new ForbiddenException('Cannot submit career readiness result for another user');
    }

    const testId = Number(data.testId);
    if (isNaN(testId)) {
      throw new Error(`Invalid testId: ${data.testId}`);
    }

    this.logger.log(`Saving career readiness result for user ${data.otrId}, test ${testId}`);

    const test = await this.repository.findTestById(testId);
    if (!test) {
      this.logger.error(`Test ${testId} not found`);
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }

    const subjectBreakdown: SubjectBreakdown = {};
    let correctAnswers = 0;
    let wrongAnswers = 0;

    test.questions.forEach((q) => {
      const subjectName = q.subject?.name || 'General';
      if (!subjectBreakdown[subjectName]) {
        subjectBreakdown[subjectName] = {
          correct: 0,
          wrong: 0,
          unanswered: 0,
          total: 0,
          score: 0,
        };
      }
      subjectBreakdown[subjectName].total++;

      const userAns = data.answers.find((a) => Number(a.questionId) === q.id);
      if (userAns) {
        if (userAns.selectedOption === q.answer) {
          correctAnswers++;
          subjectBreakdown[subjectName].correct++;
          subjectBreakdown[subjectName].score += 1;
        } else {
          wrongAnswers++;
          subjectBreakdown[subjectName].wrong++;
          subjectBreakdown[subjectName].score -= 0.25;
        }
      } else {
        subjectBreakdown[subjectName].unanswered++;
      }
    });

    const totalMarks = test.questions.length;
    const negativeMarks = wrongAnswers * 0.25;
    const totalScore = correctAnswers - negativeMarks;

    const existing = await this.repository.findExistingScore(data.otrId, testId);

    const scoreData: any = {
      totalScore,
      totalMarks,
      correctAnswers,
      wrongAnswers,
      negativeMarks,
      subjectBreakdown: subjectBreakdown as unknown as Prisma.InputJsonValue,
    };

    if (existing) {
      return await this.repository.updateScore(existing.id, scoreData);
    } else {
      return await this.repository.createScore({
        otrId: data.otrId,
        testId: testId,
        ...scoreData,
      });
    }
  }

  async getByOtrId(requesterOtrId: string, otrId: string) {
    if (requesterOtrId !== otrId) {
      throw new ForbiddenException('Access denied');
    }
    return this.repository.findByOtrId(otrId);
  }
}
