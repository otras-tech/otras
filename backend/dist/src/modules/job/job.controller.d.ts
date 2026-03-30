import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    create(createJobDto: CreateJobDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    } | null>;
}
