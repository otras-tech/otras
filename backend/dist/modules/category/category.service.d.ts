import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../database/prisma.service';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        name: string;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
