import { TestRepository } from './repository/test.repository';
import { CacheService } from '../../common/cache/cache.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestService {
    private readonly repository;
    private readonly cacheService;
    constructor(repository: TestRepository, cacheService: CacheService);
    invalidateCache(): Promise<void>;
    create(createTestDto: CreateTestDto): Promise<{
        exam: {
            id: number;
            name: string;
        };
        id: number;
        createdAt: Date;
        _count: {
            questions: number;
        };
        name: string;
    }>;
    findAll(cursor?: number, take?: number): Promise<{
        exam: {
            id: number;
            name: string;
        };
        id: number;
        createdAt: Date;
        _count: {
            questions: number;
        };
        name: string;
    }[]>;
    findOne(id: number): Promise<{
        exam: {
            id: number;
            name: string;
            noOfQuestions: number | null;
        };
        id: number;
        createdAt: Date;
        name: string;
        questions: {
            subject: {
                id: number;
                name: string;
            };
            id: number;
            text: string;
            options: string[];
        }[];
    }>;
    update(id: number, updateTestDto: UpdateTestDto): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        examId: number;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        examId: number;
    }>;
}
