import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminRepository } from './repository/admin.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminRegisterDto } from './dto/admin.dto';
import { Admin } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly repository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: AdminRegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const admin = await this.repository.create({
        ...data,
        password: hashedPassword,
      });
      return this.login(admin);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('Admin email or username already exists');
      }
      throw error;
    }
  }

  async login(admin: Omit<Admin, 'password'>) {
    const payload = { email: admin.email, sub: admin.id, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
      admin,
    };
  }

  async validateAdmin(
    email: string,
    pass: string,
  ): Promise<Omit<Admin, 'password'> | null> {
    const admin = await this.repository.findByEmail(email);
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }
}
