import { QuestionRepository } from './repository/question.repository';
export declare class QuestionService {
    private readonly questionRepository;
    constructor(questionRepository: QuestionRepository);
    create(data: {
        text: string;
        options: string[];
        answer: string;
        explanation?: string;
        subjectId: number;
    }): Promise<{
        subject: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
    findAll(query?: {
        examId?: number;
        subjectId?: number;
    }): Promise<({
        subject: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    })[]>;
    findOne(id: number): Promise<{
        subject: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
    update(id: number, data: {
        text?: string;
        options?: string[];
        answer?: string;
        explanation?: string;
        subjectId?: number;
    }): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
}
