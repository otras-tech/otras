import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTestDto: CreateTestDto): Promise<{
        exam: {
            id: number;
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
        questions: {
            id: number;
        }[];
        testSubjects: ({
            subject: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            subjectId: number;
            testId: number;
            allocatedQuestions: number;
        })[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        exam: {
            id: number;
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
        _count: {
            questions: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    })[]>;
    getPreview(examId: number): Promise<{
        id: number;
        name: string;
        count: number;
        available: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__TestClient<({
        exam: {
            id: number;
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
        questions: {
            id: number;
            createdAt: Date;
            text: string;
            options: string[];
            answer: string;
            subjectId: number;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, updateTestDto: UpdateTestDto): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
