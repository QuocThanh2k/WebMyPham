import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PagedResult } from '../../models/paged-result.model';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
    // Dữ liệu khách hàng
    customers: any[] = [];

    // Thông tin phân trang
    currentPage = 1;
    pageSize = 10;
    totalRecords = 0;
    totalPages = 0;

    // Trạng thái
    isLoading = false;
    errorMessage = '';

    // Tìm kiếm
    searchTerm = '';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    /**
     * Hàm changePage - Chuyển đến trang được chỉ định
     * @param page - Số trang cần chuyển đến (1-based index)
     */
    changePage(page: number): void {
        // Validate số trang
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }

        // Cập nhật trang hiện tại
        this.currentPage = page;

        // Gọi API để lấy dữ liệu mới
        this.loadCustomers();

        // Cuộn lên đầu danh sách
        this.scrollToTop();
    }

    /**
     * Chuyển đến trang tiếp theo
     */
    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.changePage(this.currentPage + 1);
        }
    }

    /**
     * Chuyển đến trang trước
     */
    previousPage(): void {
        if (this.currentPage > 1) {
            this.changePage(this.currentPage - 1);
        }
    }

    /**
     * Tải dữ liệu khách hàng từ API
     */
    loadCustomers(): void {
        this.isLoading = true;
        this.errorMessage = '';

        // Convert 1-based page to 0-based index for API
        const pageIndex = this.currentPage - 1;

        this.apiService.getCustomers(
            pageIndex,
            this.pageSize,
            this.searchTerm
        ).subscribe({
            next: (response: PagedResult<any>) => {
                this.customers = response.items;
                this.totalRecords = response.totalRecords;
                this.totalPages = response.totalPages;
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error('Error loading customers:', error);
                this.errorMessage = 'Không thể tải dữ liệu khách hàng. Vui lòng thử lại sau.';
                this.isLoading = false;
            }
        });
    }

    /**
     * Tìm kiếm khách hàng
     */
    onSearch(): void {
        this.currentPage = 1;
        this.loadCustomers();
    }

    /**
     * Cuộn lên đầu danh sách
     */
    private scrollToTop(): void {
        const element = document.querySelector('.customer-list-container');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Lấy danh sách các trang để hiển thị
     */
    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }
}
