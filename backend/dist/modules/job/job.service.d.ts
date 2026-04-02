import { JobRepository } from './repository/job.repository';
import { Prisma } from '@prisma/client';
export declare class JobService {
    private readonly repository;
    constructor(repository: JobRepository);
    create(data: Prisma.JobCreateInput): Promise<{
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
    update(id: number, data: Prisma.JobUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
    remove(id: number): Promise<{
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
