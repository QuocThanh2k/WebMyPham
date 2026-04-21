import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PagedResult } from '../../models/paged-result.model';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    // Dữ liệu sản phẩm
    products: any[] = [];

    // Thông tin phân trang
    currentPage = 1;
    pageSize = 10;
    totalRecords = 0;
    totalPages = 0;

    // Trạng thái
    isLoading = false;
    errorMessage = '';

    // Tìm kiếm và sắp xếp
    searchTerm = '';
    sortBy = '';
    sortOrder: 'asc' | 'desc' = 'asc';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadProducts();
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
        this.loadProducts();

        // Cuộn lên đầu danh sách (tùy chọn)
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
     * Tải dữ liệu sản phẩm từ API
     */
    loadProducts(): void {
        this.isLoading = true;
        this.errorMessage = '';

        // Convert 1-based page to 0-based index for API
        const pageIndex = this.currentPage - 1;

        this.apiService.getProducts(
            pageIndex,
            this.pageSize,
            this.searchTerm,
            this.sortBy,
            this.sortOrder
        ).subscribe({
            next: (response: PagedResult<any>) => {
                this.products = response.items;
                this.totalRecords = response.totalRecords;
                this.totalPages = response.totalPages;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.errorMessage = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
                this.isLoading = false;
            }
        });
    }

    /**
     * Tìm kiếm sản phẩm
     */
    onSearch(): void {
        this.currentPage = 1; // Reset về trang 1 khi tìm kiếm
        this.loadProducts();
    }

    /**
     * Sắp xếp sản phẩm
     */
    onSort(field: string): void {
        if (this.sortBy === field) {
            // Đổi chiều sắp xếp nếu cùng field
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortOrder = 'asc';
        }
        this.loadProducts();
    }

    /**
     * Thay đổi kích thước trang
     */
    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        this.pageSize = parseInt(select.value, 10);
        this.currentPage = 1;
        this.loadProducts();
    }

    /**
     * Cuộn lên đầu danh sách
     */
    private scrollToTop(): void {
        const element = document.querySelector('.product-list-container');
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
