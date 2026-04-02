import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    create(createJobDto: CreateJobDto): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
    findAll(cursor?: number, take?: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }[]>;
    findOne(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
}
