// ==================== PAGINATION & FILTER SYSTEM ====================

const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let filteredProducts = [...productsData]; // productsData lấy từ file data.js

// 1. Hàm loại bỏ dấu tiếng Việt (Hỗ trợ tìm kiếm không dấu)
function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9\s]/g, '');
    str = str.replace(/\s+/g, ' ').trim();
    return str;
}

// 2. Helper map dữ liệu (Chuyển đổi ID thành tên danh mục/thương hiệu)
function getMappedProduct(product) {
    return {
        ...product,
        category: categoryMap[product.categoryId] || product.categoryId,
        brand: brandMap[product.brandId] || product.brandId
    };
}

// 3. Cập nhật số lượng sản phẩm trên bộ lọc (Sidebar)
function updateFilterCounts() {
    const counts = {
        "laneige": 0, "innisfree": 0, "mac": 0, "dior": 0, "the ordinary": 0,
        "under500": 0, "500k-1m": 0, "1m-2m": 0, "over2m": 0
    };

    mappedProductsData.forEach(p => {
        const b = (p.brand || '').toLowerCase();
        if (counts.hasOwnProperty(b)) counts[b]++;

        const pr = p.price;
        if (pr < 500000) counts["under500"]++;
        else if (pr < 1000000) counts["500k-1m"]++;
        else if (pr < 2000000) counts["1m-2m"]++;
        else counts["over2m"]++;
    });

    for (let key in counts) {
        const el = document.getElementById('count-' + key.replace(' ', '-'));
        if (el) el.innerText = counts[key];
    }
}

// Map toàn bộ data trước khi load trang
const mappedProductsData = productsData.map(getMappedProduct);

// ==================== KHỞI TẠO TRANG ====================
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, rendering products...');

    // Lấy tham số từ thanh địa chỉ URL
    const urlParams = new URLSearchParams(window.location.search);
    const keywordParam = urlParams.get('keyword');
    const brandParam = urlParams.get('brand');

    // Xử lý nếu từ trang khác tìm kiếm bay sang
    if (keywordParam) {
        const keywordLower = removeVietnameseTones(keywordParam).toLowerCase();
        filteredProducts = mappedProductsData.filter(p => {
            const productNameNoTone = removeVietnameseTones(p.name).toLowerCase();
            const brandNoTone = removeVietnameseTones(p.brand).toLowerCase();
            return productNameNoTone.includes(keywordLower) || brandNoTone.includes(keywordLower);
        });

        const titleElement = document.querySelector('.products-header h2');
        if (titleElement) titleElement.textContent = 'Kết quả tìm kiếm';

        updateSearchResultCount(filteredProducts.length, keywordParam);
        showSearchTag(keywordParam);
    }
    // Xử lý nếu click từ trang thương hiệu bay sang
    else if (brandParam) {
        filteredProducts = mappedProductsData.filter(p =>
            p.brand.toLowerCase() === brandParam.toLowerCase() ||
            p.brand.toLowerCase().includes(brandParam.toLowerCase())
        );

        const titleElement = document.querySelector('.products-header h2');
        if (titleElement) titleElement.textContent = 'Sản phẩm ' + brandParam.charAt(0).toUpperCase() + brandParam.slice(1);

        const brandCheckboxes = document.querySelectorAll('#filterBox .filter-group')[1].querySelectorAll('input[type="checkbox"]');
        brandCheckboxes.forEach(cb => {
            if (cb.value.toLowerCase() === brandParam.toLowerCase() || brandParam.toLowerCase().includes(cb.value.toLowerCase())) {
                cb.checked = true;
            }
        });
    } else {
        filteredProducts = mappedProductsData; // Mặc định hiển thị tất cả
    }

    // Hiển thị lần đầu tiên
    renderProducts(getCurrentPageProducts());
    updateProductCount(filteredProducts.length);
    renderPagination();
    if (typeof fetchInventoryData === 'function') fetchInventoryData('all');
    attachEventListeners();
    updateFilterCounts();
});

// Các hàm cập nhật UI hiển thị kết quả tìm kiếm
function updateSearchResultCount(count, keyword) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = count;
    const descEl = document.querySelector('.products-header p');
    if (descEl) descEl.innerHTML = `Tìm thấy <span id="productCount">${count}</span> sản phẩm phù hợp với từ khóa "<strong>${keyword}</strong>"`;
}

function showSearchTag(keyword) {
    const activeTags = document.getElementById('activeTags');
    if (activeTags) {
        activeTags.innerHTML = `
            <div class="tag">
                <i class="fas fa-search"></i> Tìm kiếm: "${keyword}"
                <button onclick="clearSearchFilter()"><i class="fas fa-times"></i></button>
            </div>
        `;
    }
}

function clearSearchFilter() {
    const url = new URL(window.location.href);
    url.searchParams.delete('keyword');
    window.location.href = url.toString();
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput ? searchInput.value.trim() : '';
    if (!keyword) {
        alert('Vui lòng nhập từ khóa tìm kiếm!');
        if (searchInput) searchInput.focus();
        return;
    }
    window.location.href = 'products.html?keyword=' + encodeURIComponent(keyword);
}

// ==================== BẮT SỰ KIỆN TƯƠNG TÁC ====================
function attachEventListeners() {
    // 1. Chuyển trang (Pagination)
    const paginationEl = document.getElementById('pagination');
    if (paginationEl) {
        paginationEl.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const btn = e.target.closest('.pagination-btn');
            if (!btn || btn.disabled) return;

            const page = btn.dataset.page;
            const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

            if (page === 'prev' && currentPage > 1) currentPage--;
            else if (page === 'next' && currentPage < totalPages) currentPage++;
            else if (page !== 'prev' && page !== 'next') currentPage = parseInt(page);

            renderProducts(getCurrentPageProducts());
            renderPagination();
            document.querySelector('.products-content').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 2. Click Checkbox Lọc Sidebar
    const filterBox = document.getElementById('filterBox');
    if (filterBox) {
        filterBox.addEventListener('change', function (e) {
            if (e.target.matches('input[type="checkbox"]')) {
                e.preventDefault();
                e.stopPropagation();
                filterProducts();
            }
        });
    }

    // 3. Sắp xếp (Sort)
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function (e) {
            e.preventDefault();
            sortProducts(this.value);
        });
    }

    // 4. Nút Xóa bộ lọc
    const clearBtn = document.getElementById('btnClearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            clearAllFilters();
        });
    }

    // 5. Nút lọc nhanh danh mục (ĐÃ FIX ÉP LỌC)
    document.querySelectorAll('.category-quick-links a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            document.querySelectorAll('.category-quick-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const categoryKey = this.dataset.category;

            if (categoryKey === 'all') {
                filteredProducts = [...mappedProductsData];
            } else {
                filteredProducts = mappedProductsData.filter(p => {
                    const catStr = (p.category || '').toLowerCase();
                    const nameStr = (p.name || '').toLowerCase();

                    switch (categoryKey) {
                        case 'skincare': return catStr.includes('kem dưỡng') || catStr.includes('chăm sóc da') || nameStr.includes('kem') || nameStr.includes('cream') || nameStr.includes('toner') || nameStr.includes('serum');
                        case 'makeup': return catStr.includes('trang điểm') || nameStr.includes('phấn') || nameStr.includes('cushion') || nameStr.includes('foundation');
                        case 'perfume': return catStr.includes('nước hoa') || nameStr.includes('perfume') || nameStr.includes('parfum');
                        case 'lipstick': return catStr.includes('son') || catStr.includes('son môi') || nameStr.includes('lip');
                        default: return p.category === categoryKey;
                    }
                });
            }

            currentPage = 1;
            renderProducts(getCurrentPageProducts());
            updateProductCount(filteredProducts.length);
            renderPagination();
        });
    });
}

// ==================== LOGIC LỌC & RENDER ====================
function getCurrentPageProducts() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let html = `<button class="pagination-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>...</span>`;
        }
    }

    html += `<button class="pagination-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    paginationEl.innerHTML = html;
}

function filterProducts() {
    const filterGroups = document.querySelectorAll('#filterBox .filter-group');

    const categories = Array.from(filterGroups[0].querySelectorAll('input:checked')).map(cb => cb.value);
    const brands = Array.from(filterGroups[1].querySelectorAll('input:checked')).map(cb => cb.value.toLowerCase());
    const prices = Array.from(filterGroups[2].querySelectorAll('input:checked')).map(cb => cb.value);
    const skinTypes = Array.from(filterGroups[3].querySelectorAll('input:checked')).map(cb => cb.value);

    filteredProducts = mappedProductsData.filter(product => {
        if (categories.length > 0 && !categories.includes(product.category)) return false;
        if (brands.length > 0 && !brands.includes(product.brand.toLowerCase())) return false;
        if (skinTypes.length > 0 && !skinTypes.includes(product.skinType)) return false;

        if (prices.length > 0) {
            const p = product.price;
            const matchPrice = prices.some(range => {
                if (range === 'under500') return p < 500000;
                if (range === '500k-1m') return p >= 500000 && p < 1000000;
                if (range === '1m-2m') return p >= 1000000 && p < 2000000;
                if (range === 'over2m') return p >= 2000000;
                return false;
            });
            if (!matchPrice) return false;
        }
        return true;
    });

    currentPage = 1;
    renderProducts(getCurrentPageProducts());
    updateProductCount(filteredProducts.length);
    renderPagination();
}

function sortProducts(sortType) {
    switch (sortType) {
        case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
        case 'name-asc': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc': filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'newest': filteredProducts.sort((a, b) => b.id - a.id); break;
        case 'bestseller': filteredProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0)); break;
    }
    currentPage = 1;
    renderProducts(getCurrentPageProducts());
    renderPagination();
}

function clearAllFilters() {
    document.querySelectorAll('#filterBox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.category-quick-links a').forEach(l => l.classList.remove('active'));
    document.querySelector('.category-quick-links a').classList.add('active');
    filteredProducts = [...mappedProductsData];
    currentPage = 1;
    renderProducts(getCurrentPageProducts());
    updateProductCount(filteredProducts.length);
    renderPagination();
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;"><i class="fas fa-search" style="font-size:60px;color:#ccc;margin-bottom:20px;"></i><h3>Không tìm thấy sản phẩm</h3></div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
        const badge = discount > 0 ? `<span class="product-badge sale">-${discount}%</span>` : '';
        const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        const originalPrice = product.originalPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice) : '';

        return `
            <a href="product-detail.html?id=${product.id}" class="product-link">
            <div class="product-card">
                <div class="product-image">
                    ${badge}
                    <div class="product-actions">
                        <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                        <button class="view-btn"><i class="far fa-eye"></i></button>
                    </div>
                    <div class="product-quick-add">
                        <button class="add-to-cart" onclick="addToCartFromProducts('${product.id}'); event.preventDefault(); event.stopPropagation();"><i class="fas fa-shopping-bag"></i> Thêm vào giỏ</button>
                    </div>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <p class="product-brand">${product.brand}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></span>
                        <span class="count">(${product.stock})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${price}</span>
                        ${originalPrice ? `<span class="original-price">${originalPrice}</span>` : ''}
                    </div>
                </div>
            </div>
            </a>
        `;
    }).join('');
}

function updateProductCount(count) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = count;
}

// ==================== XỬ LÝ GIỎ HÀNG ====================
function addToCartFromProducts(productId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        setTimeout(() => window.location.href = 'login.html', 500);
        return;
    }

    let product = productsData.find(p => p.id === productId);
    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }

    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; }
    catch (e) { cart = []; }

    const existingIndex = cart.findIndex(item => Number(item.id) === Number(productId) || item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalQuantity);

    alert(`Đã thêm "${product.name}" vào giỏ hàng!\n\nSố lượng trong giỏ: ${totalQuantity}`);
}