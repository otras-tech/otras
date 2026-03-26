import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
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
    update(id: string, updateCategoryDto: UpdateCategoryDto): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__MockTestCategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
