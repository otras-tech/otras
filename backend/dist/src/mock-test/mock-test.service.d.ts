import { PrismaService } from '../prisma/prisma.service';
export declare class MockTestService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(categoryId?: number): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        title: string;
        duration: number;
        sectionType: string;
        isProctored: boolean;
        isAdaptive: boolean;
        categoryId: number;
    })[]>;
    findOne(id: number): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        title: string;
        duration: number;
        sectionType: string;
        isProctored: boolean;
        isAdaptive: boolean;
        categoryId: number;
    }) | null>;
    startAttempt(otrId: string, mockTestOrTestId: number): Promise<{
        id: number;
        otrId: string;
        score: number;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
        idempotencyKey: string | null;
        correctAnswers: number | null;
        attemptedAt: Date;
        mockTestId: number;
    }>;
    submitAttempt(dto: {
        otrId: string;
        mockTestId: number;
        score: number;
        totalMarks: number;
    }): Promise<{
        id: number;
        otrId: string;
        score: number;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
        idempotencyKey: string | null;
        correctAnswers: number | null;
        attemptedAt: Date;
        mockTestId: number;
    }>;
    getRecentAttempt(otrId: string): Promise<({
        mockTest: {
            category: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            examId: number | null;
            title: string;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
            categoryId: number;
        };
    } & {
        id: number;
        otrId: string;
        score: number;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
        idempotencyKey: string | null;
        correctAnswers: number | null;
        attemptedAt: Date;
        mockTestId: number;
    }) | null>;
    calculateRank(mockTestId: number, otrId: string): Promise<{
        msg: string;
        total: number;
        rank?: undefined;
        topPercentage?: undefined;
        percentile?: undefined;
    } | {
        rank: number;
        total: number;
        topPercentage: number;
        percentile: number;
        msg?: undefined;
    }>;
    submitExamAttempt(dto: {
        otrId: string;
        examId: number;
        score: number;
        totalMarks: number;
        attemptId?: number;
        correctAnswers?: number;
        subjectBreakdown?: any;
    }): Promise<{
        id: number;
        otrId: string;
        score: number;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
        idempotencyKey: string | null;
        correctAnswers: number | null;
        attemptedAt: Date;
        mockTestId: number;
    }>;
    getUserMockAttempts(otrId: string): Promise<({
        mockTest: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            examId: number | null;
            title: string;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
            categoryId: number;
        };
    } & {
        id: number;
        otrId: string;
        score: number;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
        idempotencyKey: string | null;
        correctAnswers: number | null;
        attemptedAt: Date;
        mockTestId: number;
    })[]>;
}
