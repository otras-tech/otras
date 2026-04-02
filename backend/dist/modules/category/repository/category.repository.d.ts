import { PrismaService } from '../../../database/prisma.service';
export declare class CategoryRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(name: string): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
    findAll(): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }[]>;
    findById(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    } | null>;
    update(id: number, name: string): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
    softDelete(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
}
