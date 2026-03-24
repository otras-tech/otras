import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
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
    getPreview(examId: string): Promise<{
        id: number;
        name: string;
        count: number;
        available: number;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__TestClient<({
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
    update(id: string, updateTestDto: UpdateTestDto): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: number;
        name: string;
        createdAt: Date;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
