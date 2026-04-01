import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestService {
    private prisma;
    private cacheService;
    constructor(prisma: PrismaService, cacheService: CacheService);
    invalidateCache(): Promise<void>;
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
    findAll(cursor?: number, take?: number): import(".prisma/client").Prisma.PrismaPromise<{
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
    update(id: number, updateTestDto: UpdateTestDto): Promise<{
        isDeleted: boolean;
        name: string;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        name: string;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
