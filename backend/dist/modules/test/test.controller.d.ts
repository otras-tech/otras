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
