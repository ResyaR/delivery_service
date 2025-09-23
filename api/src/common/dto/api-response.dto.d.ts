export declare class ApiResponseDto<T = any> {
    message: string;
    data?: T;
    error?: string;
}
export declare class PaginatedResponseDto<T = any> {
    message: string;
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
