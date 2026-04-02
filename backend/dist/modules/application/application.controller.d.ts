import { ApplicationService } from './application.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(dto: CreateApplicationDto, req: any): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    }>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[]>;
    findByUser(userId: number, req: any): Promise<({
        exam: {
            id: number;
            name: string;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[]>;
    findAll(): Promise<({
        user: {
            password: string;
            role: string;
            isDeleted: boolean;
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            age: number | null;
            category: string | null;
            otrId: string;
            highestDegree: string | null;
            careerPreference: string | null;
            domicile: string | null;
            pincode: string | null;
            createdAt: Date;
            updatedAt: Date;
            credits: number;
            referralCode: string;
            preferredLanguage: string;
        };
        exam: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[]>;
    updateStatus(id: number, statusData: UpdateApplicationStatusDto, req: any): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    }>;
}
