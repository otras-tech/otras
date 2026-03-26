import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
    create(createTestDto: CreateTestDto): Promise<{
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        examId: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            questions: number;
        };
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        examId: number;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__TestClient<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
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
            updatedAt: Date;
            text: string;
            options: string[];
            answer: string;
            explanation: string | null;
            subjectId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        examId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateTestDto: UpdateTestDto): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__TestClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
