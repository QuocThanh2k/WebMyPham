import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult, PaginationParams } from '../models/paged-result.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'https://your-api-domain.com/api';

    constructor(private http: HttpClient) { }

    /**
     * Get paginated products from API
     * @param pageIndex - Page number (0-based)
     * @param pageSize - Number of items per page
     * @param searchTerm - Optional search term
     * @param sortBy - Optional sort field
     * @param sortOrder - Optional sort order ('asc' or 'desc')
     */
    getProducts(
        pageIndex: number,
        pageSize: number,
        searchTerm?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc'
    ): Observable<PagedResult<any>> {
        let params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }
        if (sortBy) {
            params = params.set('sortBy', sortBy);
        }
        if (sortOrder) {
            params = params.set('sortOrder', sortOrder);
        }

        return this.http.get<PagedResult<any>>(`${this.baseUrl}/products`, { params });
    }

    /**
     * Get paginated customers from API
     * @param pageIndex - Page number (0-based)
     * @param pageSize - Number of items per page
     * @param searchTerm - Optional search term
     */
    getCustomers(
        pageIndex: number,
        pageSize: number,
        searchTerm?: string
    ): Observable<PagedResult<any>> {
        let params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }

        return this.http.get<PagedResult<any>>(`${this.baseUrl}/customers`, { params });
    }

    /**
     * Generic method for paginated requests
     */
    getPagedData<T>(
        endpoint: string,
        params: PaginationParams
    ): Observable<PagedResult<T>> {
        let httpParams = new HttpParams()
            .set('pageIndex', params.pageIndex.toString())
            .set('pageSize', params.pageSize.toString());

        if (params.searchTerm) {
            httpParams = httpParams.set('searchTerm', params.searchTerm);
        }
        if (params.sortBy) {
            httpParams = httpParams.set('sortBy', params.sortBy);
        }
        if (params.sortOrder) {
            httpParams = httpParams.set('sortOrder', params.sortOrder);
        }

        return this.http.get<PagedResult<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
    }
}
