import { ApplicationService } from './application.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(dto: CreateApplicationDto): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByUser(userId: number): Promise<({
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        user: {
            password: string;
            role: string;
            isDeleted: boolean;
            email: string;
            firstName: string;
            lastName: string;
            otrId: string;
            age: number | null;
            category: string | null;
            highestDegree: string | null;
            careerPreference: string | null;
            domicile: string | null;
            pincode: string | null;
            referralCode: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            credits: number;
            preferredLanguage: string;
        };
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: number, statusData: UpdateApplicationStatusDto): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
