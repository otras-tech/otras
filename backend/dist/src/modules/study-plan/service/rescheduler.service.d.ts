export declare class ReschedulerService {
    private readonly logger;
    private missedTasks;
    storeMissedTask(userId: number, activity: any): Promise<void>;
    getMissedTasks(userId: number): Promise<any[]>;
    clearMissedTasks(userId: number): Promise<void>;
}
