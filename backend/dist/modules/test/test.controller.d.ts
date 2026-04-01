import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
    create(createTestDto: CreateTestDto): Promise<{
        exam: {
            name: string;
            id: number;
        };
        name: string;
        id: number;
        createdAt: Date;
        _count: {
            questions: number;
        };
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        exam: {
            name: string;
            id: number;
        };
        name: string;
        id: number;
        createdAt: Date;
        _count: {
            questions: number;
        };
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__TestClient<{
        exam: {
            name: string;
            id: number;
            noOfQuestions: number | null;
        };
        name: string;
        id: number;
        createdAt: Date;
        questions: {
            subject: {
                name: string;
                id: number;
            };
            id: number;
            text: string;
            options: string[];
        }[];
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateTestDto: UpdateTestDto): Promise<{
        isDeleted: boolean;
        name: string;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        isDeleted: boolean;
        name: string;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
