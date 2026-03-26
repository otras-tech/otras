import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PypService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.pYP.create({ data });
    }

    async findAll() {
        return this.prisma.pYP.findMany({
            include: { exam: true }
        });
    }

    async update(id: number, data: any) {
        return this.prisma.pYP.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.pYP.delete({ where: { id } });
    }
}
