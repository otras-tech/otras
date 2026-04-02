import { SubjectRepository } from './repository/subject.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectService {
    private readonly subjectRepository;
    constructor(subjectRepository: SubjectRepository);
    create(data: CreateSubjectDto): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    findAll(cursor?: number, take?: number): Promise<({
        exams: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        }[];
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
    findOne(id: number): Promise<{
        exams: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        }[];
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    update(id: number, data: UpdateSubjectDto): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
}
