import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    create(createJobDto: CreateJobDto): Promise<{
        isDeleted: boolean;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        deadline: Date;
    }>;
    findAll(): Promise<{
        isDeleted: boolean;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        deadline: Date;
    }[]>;
    findOne(id: number): Promise<{
        isDeleted: boolean;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        deadline: Date;
    } | null>;
}
