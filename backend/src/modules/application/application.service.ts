import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApplicationRepository } from './repository/application.repository';
import { UpdateApplicationStatusDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  /**
   * Ownership enforced: user can only apply for themselves.
   */
  async create(requesterId: number, requesterRole: string, userId: number, examId: number) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('You can only apply for yourself');
    }
    return this.applicationRepository.upsert(userId, examId);
  }

  /**
   * Ownership enforced: user can only view their own applications.
   */
  async findByUser(requesterId: number, requesterRole: string, userId: number) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.applicationRepository.findByUserId(userId);
  }

  async findByOtrId(otrId: string) {
    const result = await this.applicationRepository.findByOtrId(otrId);
    if (result === null) return [];
    return result;
  }

  async findAll() {
    return this.applicationRepository.findAll();
  }

  /**
   * Admin-only: validates resource exists before update.
   */
  async updateStatus(
    requesterRole: string,
    id: number,
    statusData: UpdateApplicationStatusDto,
  ) {
    if (requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update application status');
    }
    const existing = await this.applicationRepository.findById(id);
    if (!existing) throw new NotFoundException('Application not found');
    return this.applicationRepository.updateStatus(id, statusData as any);
  }
}
