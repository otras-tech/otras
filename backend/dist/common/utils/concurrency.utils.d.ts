export declare function limitConcurrency<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]>;
export declare function pMap<T, R>(items: T[], mapper: (item: T, index: number) => Promise<R>, concurrency: number): Promise<R[]>;
