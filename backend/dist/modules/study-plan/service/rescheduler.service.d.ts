interface MissedTask {
    activityId: string;
    description: string;
    timeSlot: string;
    date: string;
}
export declare class ReschedulerService {
    private missedTasks;
    storeMissedTask(userId: number, activity: MissedTask): Promise<void>;
    getMissedTasks(userId: number): Promise<MissedTask[]>;
    clearMissedTasks(userId: number): Promise<void>;
}
export {};
