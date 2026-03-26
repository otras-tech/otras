import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, examId: number) {
        return this.prisma.application.upsert({
            where: {
                userId_examId: {
                    userId,
                    examId,
                },
            },
            update: {},
            create: {
                userId,
                examId,
            },
        });
    }

    async findByUser(userId: number) {
        return this.prisma.application.findMany({
            where: { userId },
            include: {
                exam: true,
            },
        });
    }

    async findByOtrId(otrId: string) {
        const user = await this.prisma.user.findUnique({
            where: { otrId },
        });
        if (!user) return [];
        return this.prisma.application.findMany({
            where: { userId: user.id },
            include: {
                exam: true,
            },
        });
    }

    async findAll() {
        return this.prisma.application.findMany({
            include: {
                user: true,
                exam: true,
            },
        });
    }

    async updateStatus(id: number, statusData: any) {
        return this.prisma.application.update({
            where: { id },
            data: statusData,
        });
    }
}
