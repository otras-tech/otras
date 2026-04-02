import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
    findAll(): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }[]>;
    findOne(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        name: string;
    }>;
}
