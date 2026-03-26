import { ApplicationService } from './application.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(dto: CreateApplicationDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByUser(userId: number): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            age: number | null;
            category: string | null;
            otrId: string;
            highestDegree: string | null;
            careerPreference: string | null;
            domicile: string | null;
            pincode: string | null;
            credits: number;
            referralCode: string;
            preferredLanguage: string;
            isDeleted: boolean;
        };
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: number, statusData: UpdateApplicationStatusDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
