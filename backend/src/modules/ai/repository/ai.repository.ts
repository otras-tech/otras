import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AiRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(data: Prisma.IntelligenceProfileUncheckedCreateInput) {
    return this.prisma.intelligenceProfile.create({ data });
  }

  async createRoadmap(data: Prisma.RoadmapUncheckedCreateInput) {
    return this.prisma.roadmap.create({ data });
  }

  async updateRoadmap(id: string, data: Prisma.RoadmapUpdateInput) {
    return this.prisma.roadmap.update({
      where: { id },
      data,
    });
  }

  async findRoadmapById(id: string) {
    return this.prisma.roadmap.findUnique({
      where: { id, isDeleted: false },
      include: { IntelligenceProfile: true },
    });
  }

  async findRoadmapByJobId(jobId: string) {
    return this.prisma.roadmap.findFirst({
      where: { jobId, isDeleted: false },
    });
  }
}
