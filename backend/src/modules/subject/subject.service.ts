import { Injectable, NotFoundException } from '@nestjs/common';
import { SubjectRepository } from './repository/subject.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  create(data: CreateSubjectDto) {
    const { examId, ...rest } = data as CreateSubjectDto & { examId?: number };
    const createInput: any = { ...rest };
    if (examId) {
      createInput.exams = { connect: { id: examId } };
    }
    return this.subjectRepository.create(createInput);
  }

  findAll(cursor?: number, take?: number) {
    return this.subjectRepository.findAll(cursor, take);
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  update(id: number, data: UpdateSubjectDto) {
    const { examId, ...rest } = data as UpdateSubjectDto & { examId?: number };
    const updateInput: any = { ...rest };
    if (examId) {
      updateInput.exams = { connect: { id: examId } };
    }
    return this.subjectRepository.update(id, updateInput);
  }

  remove(id: number) {
    return this.subjectRepository.softDelete(id);
  }
}
