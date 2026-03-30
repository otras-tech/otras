import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Admin } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async register(data: any): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const admin = await this.prisma.admin.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return admin;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Admin email or username already exists');
      }
      throw error;
    }
  }

  async validateAdmin(identifier: string, pass: string): Promise<Admin | null> {
    let admin = await this.prisma.admin.findUnique({ where: { email: identifier } });
    if (!admin) {
      admin = await this.prisma.admin.findUnique({ where: { username: identifier } });
    }
    
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      return admin;
    }
    return null;
  }
}
