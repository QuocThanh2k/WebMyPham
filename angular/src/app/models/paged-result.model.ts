// Interface for paginated response from API
export interface PagedResult<T> {
    items: T[];
    totalRecords: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Interface for pagination parameters
export interface PaginationParams {
    pageIndex: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
