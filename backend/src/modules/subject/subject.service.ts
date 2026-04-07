import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { SubjectRepository } from './repository/subject.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly cacheService: CacheService,
  ) { }

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['subjects_all'], ['subject_details_*']);
  }

  async create(data: CreateSubjectDto) {
    const { examId, ...rest } = data as CreateSubjectDto & { examId?: number };
    const createInput: any = { ...rest };
    if (examId) {
      createInput.exams = { connect: { id: examId } };
    }
    const result = await this.subjectRepository.create(createInput);
    await this.invalidateCache();
    return result;
  }

  findAll(cursor?: number, take?: number) {
    return this.subjectRepository.findAll(cursor, take);
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(id: number, data: UpdateSubjectDto) {
    const { examId, ...rest } = data as UpdateSubjectDto & { examId?: number };
    const updateInput: any = { ...rest };
    if (examId) {
      updateInput.exams = { connect: { id: examId } };
    }
    const result = await this.subjectRepository.update(id, updateInput);
    await this.invalidateCache();
    await this.cacheService.del(`subject_details_${id}`);
    return result;
  }

  async remove(id: number) {
    const result = await this.subjectRepository.softDelete(id);
    await this.invalidateCache();
    await this.cacheService.del(`subject_details_${id}`);
    return result;
  }
}
