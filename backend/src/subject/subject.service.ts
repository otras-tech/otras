import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectService {
    constructor(private prisma: PrismaService) { }

    create(data: { name: string, examId?: number }) {
        const { examId, ...rest } = data;
        return this.prisma.subject.create({
            data: {
                ...rest,
                ...(examId && {
                    exams: {
                        connect: { id: examId }
                    }
                })
            }
        });
    }

    findAll() {
        return this.prisma.subject.findMany({
            include: { exams: true, questions: true },
        });
    }

    findOne(id: number) {
        return this.prisma.subject.findUnique({
            where: { id },
            include: { exams: true, questions: true },
        });
    }

    update(id: number, data: { name?: string, examId?: number }) {
        const { examId, ...rest } = data;
        return this.prisma.subject.update({
            where: { id },
            data: {
                ...rest,
                ...(examId && {
                    exams: {
                        connect: { id: examId }
                    }
                })
            }
        });
    }

    remove(id: number) {
        return this.prisma.subject.delete({
            where: { id },
        });
    }
}
