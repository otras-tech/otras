  import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AdminRepository } from './repository/admin.repository';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { AdminRegisterDto } from './dto/admin.dto';
import { Admin } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {
  constructor(
    private readonly repository: AdminRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findById(id: number) {
    return this.repository.findById(id);
  }



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
    const tokens = await this.authService.getTokens(admin.id, admin.email, 'ADMIN');
    return {
      ...tokens,
      admin,
    };
  }


  async validateAdmin(email: string, pass: string): Promise<Admin | null> {
    const admin = await this.repository.findByEmail(email);
    if (admin && !admin.isDeleted) {
      if (await bcrypt.compare(pass, admin.password)) {
        return admin;
      }
    }
    return null;
  }

}
