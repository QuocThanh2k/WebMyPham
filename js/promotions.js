function addToCart(event, productId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    // 1. Lấy dữ liệu giỏ hàng hiện tại từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 2. Tìm thông tin sản phẩm từ biến productsData (đã nạp từ data.js)
    const product = productsData.find(p => p.id === productId);

    if (product) {
        // 3. Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        // 4. Lưu lại vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // 5. Cập nhật con số hiển thị trên icon giỏ hàng ở Header
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);

        // 6. Thông báo cho người dùng
        alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
    }
}

function copyCoupon(code) {
    navigator.clipboard.writeText(code).then(function () {
        // Tạo hiệu ứng nhỏ nhắn khi copy thay vì alert cứng nhắc
        alert('🎉 Tuyệt vời! Bạn đã sao chép thành công mã: ' + code + '\nHãy áp dụng ở bước thanh toán nhé!');
    }).catch(function (err) {
        alert('Không thể sao chép mã: ' + code);
    });
}

// Tương tác tab cơ bản
document.querySelectorAll('.promo-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.promo-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// NEW: Smart product filtering + rendering for promotions page
document.addEventListener('DOMContentLoaded', function () {
    // Hàm cập nhật số lượng sản phẩm hiển thị trên Sidebar
    function updateCounts() {
        const lowStockCount = productsData.filter(p => p.stock <= 20).length;
        document.getElementById('count-lowstock').textContent = `(${lowStockCount})`;

        // Cập nhật số lượng cho từng danh mục
        for (let i = 1; i <= 5; i++) {
            const catId = `cat_00${i}`;
            const count = productsData.filter(p => p.categoryId === catId && (p.originalPrice || p.stock <= 20)).length;
            const el = document.getElementById(`count-cat${i}`);
            if (el) el.textContent = `(${count})`;
        }
    }

    function renderPromoProducts() {
        const grid = document.getElementById('promo-product-grid');

        // Lấy trạng thái từ các checkbox
        const isFlashSaleChecked = document.getElementById('filter-flashsale').checked;
        const isLowStockChecked = document.getElementById('filter-lowstock').checked;
        const selectedCats = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);

        let filtered = productsData.filter(p => {
            const discountPercent = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) : 0;
            const isFlash = discountPercent > 0.3;
            const isLow = p.stock <= 20;
            const isOnSale = p.originalPrice && p.originalPrice > p.price;

            // Logic lọc kết hợp
            let matchStatus = true;
            if (isFlashSaleChecked || isLowStockChecked) {
                matchStatus = (isFlashSaleChecked && isFlash) || (isLowStockChecked && isLow);
            } else {
                matchStatus = isOnSale || isLow; // Mặc định hiện tất cả đồ sale/sắp hết
            }

            let matchCat = selectedCats.length === 0 || selectedCats.includes(p.categoryId);

            return matchStatus && matchCat;
        });

        grid.innerHTML = filtered.map(p => {
            const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
            const price = p.price.toLocaleString() + 'đ';
            const originalPrice = p.originalPrice ? p.originalPrice.toLocaleString() + 'đ' : '';
            return `
            <a href="product-detail.html?id=${p.id}" class="product-link" style="text-decoration: none; color: inherit;">
                <div class="product-card">
                    ${discount > 0 ? `<span class="product-badge sale">-${discount}%</span>` : ''}
                    <div class="product-image">
                        <div class="product-actions">
                            <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                            <button class="view-btn"><i class="far fa-eye"></i></button>
                        </div>
                        <div class="product-quick-add">
                            <button class="add-to-cart btn-add-cart" onclick="addToCart(event, '${p.id}'); event.preventDefault(); event.stopPropagation();">
                                <i class="fas fa-shopping-bag"></i> Thêm vào giỏ
                            </button>
                        </div>
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${brandMap[p.brandId] || 'Unknown'}</p>
                        <h3 class="product-name">${p.name}</h3>
                        <div class="product-rating">
                            <span class="stars">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                            </span>
                            <span class="count">(${p.stock})</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${price}</span>
                            ${originalPrice ? `<span class="original-price">${originalPrice}</span>` : ''}
                        </div>
                    </div>
                </div>
            </a>`;
        }).join('');
    }

    // Lắng nghe sự kiện thay đổi trên các checkbox
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.addEventListener('change', renderPromoProducts);
    });

    // Khởi tạo
    updateCounts();
    renderPromoProducts();
});

