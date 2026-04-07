import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { ApplicationRepository } from './repository/application.repository';
import { UpdateApplicationStatusDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly cacheService: CacheService,
  ) { }

  async invalidateCache(userId?: number) {
    const keys = ['applications_all'];
    if (userId) keys.push(`user_applications_${userId}`);
    await this.cacheService.safeInvalidate(keys, ['application_details_*']);
  }

  /**
   * Ownership enforced: user can only apply for themselves.
   */
  async create(requesterId: number, requesterRole: string, userId: number, examId: number) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('You can only apply for yourself');
    }
    const result = await this.applicationRepository.upsert(userId, examId);
    await this.invalidateCache(userId);
    return result;
  }

  /**
   * Ownership enforced: user can only view their own applications.
   */
  async findByUser(requesterId: number, requesterRole: string, userId: number, cursor?: number, take?: number) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.applicationRepository.findByUserId(userId, cursor, take);
  }

  async findByOtrId(otrId: string, cursor?: number, take?: number) {
    const result = await this.applicationRepository.findByOtrId(otrId, cursor, take);
    if (result === null) return [];
    return result;
  }

  async findAll(cursor?: number, take?: number) {
    return this.applicationRepository.findAll(cursor, take);
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
    const result = await this.applicationRepository.updateStatus(id, statusData as any);
    await this.invalidateCache(result.userId);
    return result;
  }
}
