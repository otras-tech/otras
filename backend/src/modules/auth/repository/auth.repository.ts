import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.refreshToken.create({ data });
  }

  async findTokenById(id: string) {
    return this.prisma.refreshToken.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async deleteToken(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.refreshToken.delete({ where: { id } }).catch(() => null);
  }

  async deleteTokensByUserId(userId: number, userType: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.refreshToken.deleteMany({ where: { userId, userType } });
  }

  async deleteTokenByJti(id: string, userId: number, userType: string) {
    return this.prisma.refreshToken.deleteMany({
      where: { id, userId, userType },
    });
  }

  async countTokensByUserId(userId: number, userType: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.refreshToken.count({ where: { userId, userType } });
  }

  async findOldestSession(userId: number, userType: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma;
    return prisma.refreshToken.findFirst({
      where: { userId, userType },
      orderBy: { createdAt: 'asc' },
    });
  }

  async runTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
