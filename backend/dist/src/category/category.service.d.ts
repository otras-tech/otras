import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        id: number;
        name: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
