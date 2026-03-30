export declare class PaginatedResultDto<T> {
    data: T[];
    count: number;
    nextCursor?: number | string | null;
    hasNextPage: boolean;
}
export interface PaginationParams {
    limit?: number;
    cursor?: number | string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}
export declare function buildPaginatedResponse<T>(items: T[], requestedLimit: number, cursorField?: keyof T): PaginatedResultDto<T>;
