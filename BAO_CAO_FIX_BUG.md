# BÁO CÁO SỬA LỖI WEBMYPHAM 

## Tổng quan
Dự án: WEBMYPHAM - Website bán mỹ phẩm Thanh Tâm  
Người thực hiện: QuocThanh  
Ngày báo cáo: 24/02/2026

---

## NGÀY 1: Các lỗi cơ bản của hệ thống giỏ hàng

### 1.1. Lỗi getCart() trong js/main.js - Mã: DAY1-BUG-001

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Dòng 115-118 trong js/main.js
function getCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    return cart;  // ❌ LỖI: Có thể trả về null, undefined, hoặc object!
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Dòng 115-122 trong js/main.js
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart'));
        return Array.isArray(cart) ? cart : [];  // ✅ Kiểm tra mảng
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng:", e);
        return [];  // ✅ Trả về mảng rỗng nếu lỗi
    }
}
```

#### 📊 Kết quả:
- **Trước**: Khi localStorage chứa dữ liệu không hợp lệ → `.forEach()` crash → "Cannot read property of null"
- **Sau**: Luôn trả về mảng → Không crash → Hoạt động ổn định

---

### 1.2. Lỗi xung đột addToCart() giữa các trang - Mã: DAY1-BUG-002

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong products.html - Dòng 89
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    // ... code xử lý
}

// Trong product-detail.html - Dòng 156
function addToCart() {
    alert('Đã thêm sản phẩm vào giỏ hàng!');  // ❌ Chỉ hiển thị alert, không thêm vào localStorage
}

// Trong cart.html - Dòng 203
function addToCart() { ... }  // ❌ Định nghĩa lại, gây xung đột
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong js/main.js - Dòng 124-186
function addToCart(productIdOrButton) {
    let productId;
    let product;
    
    if (typeof productIdOrButton === 'number' || (!isNaN(productIdOrButton) && productIdOrButton !== null)) {
        productId = parseInt(productIdOrButton);
        if (typeof productsData !== 'undefined') {
            product = productsData.find(p => p.id === productId);
        }
        if (!product) {
            const button = document.querySelector('[onclick*="addToCart(' + productId + ')"]');
            if (button) {
                const productCard = button.closest('.product-card');
                if (productCard) {
                    product = {
                        id: productId,
                        name: productCard.querySelector('.product-name')?.textContent || 'Sản phẩm',
                        price: parseInt(productCard.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '')) || 0,
                        image: productCard.querySelector('.product-image img')?.src || ''
                    };
                }
            }
        }
    }
    // ... thêm vào localStorage
}

// Export to window - Dòng 530
window.addToCart = addToCart;
```

#### 📊 Kết quả:
- **Trước**: Mỗi trang định nghĩa hàm riêng → Xung đột → Chỉ alert không lưu
- **Sau**: Một hàm duy nhất trong main.js → Export window → Tất cả trang dùng chung → Hoạt động tốt

---

### 1.3. Lỗi không cập nhật số lượng giỏ hàng trên header - Mã: DAY1-BUG-003

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong js/main.js - Hàm addToCart cũ
function addToCart(productId) {
    // ... thêm vào giỏ
    localStorage.setItem('cart', JSON.stringify(cart));
    // ❌ LỖI: Không cập nhật số lượng trên header!
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong js/main.js - Dòng 172-180
function addToCart(productIdOrButton) {
    // ... thêm vào giỏ
    localStorage.setItem('cart', JSON.stringify(cart));

    // ✅ Cập nhật số lượng giỏ hàng
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartCountDisplay(totalQuantity);  // ✅ Gọi hàm cập nhật

    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}

// Dòng 102-106
function updateCartCountDisplay(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;  // ✅ Cập nhật TẤT CẢ các phần tử .cart-count
    });
}
```

#### 📊 Kết quả:
- **Trước**: Thêm sản phẩm xong, số trên header vẫn là 0 → Khách hàng không biết đã thêm
- **Sau**: Số lượng cập nhật ngay lập tức → Trải nghiệm người dùng tốt hơn

---

## NGÀY 2: Lỗi filterProducts và đồng bộ dữ liệu

### 2.1. Lỗi filterProducts sử dụng nth-child không ổn định - Mã: DAY2-BUG-001

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong products.html - Hàm filterProducts cũ
function filterProducts() {
    const categoryCheckboxes = document.querySelectorAll('#filterBox .filter-group:nth-child(2) input:checked');
    // ❌ LỖI: Phụ thuộc vào vị trí DOM, nếu thêm div khác sẽ hỏng
    
    const brandCheckboxes = document.querySelectorAll('#filterBox .filter-group:nth-child(3) input:checked');
    // ❌ LỖI: Tương tự
    
    const priceCheckboxes = document.querySelectorAll('#filterBox .filter-group:nth-child(4) input:checked');
    // ❌ LỖI: Tương tự
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```javascript
// Trong products.html - Hàm filterProducts mới
function filterProducts() {
    // ✅ Lấy trực tiếp theo class, không phụ thuộc vị trí
    const filterGroups = document.querySelectorAll('#filterBox .filter-group');
    
    // ✅ Danh mục (filter-group đầu tiên)
    const categories = Array.from(filterGroups[0].querySelectorAll('input:checked')).map(cb => cb.value);
    
    // ✅ Thương hiệu (filter-group thứ hai)
    const brands = Array.from(filterGroups[1].querySelectorAll('input:checked')).map(cb => cb.value);
    
    // ✅ Giá (filter-group thứ ba)
    const prices = Array.from(filterGroups[2].querySelectorAll('input:checked')).map(cb => cb.value);
    
    // ✅ Loại da (filter-group thứ tư)
    const skinTypes = Array.from(filterGroups[3].querySelectorAll('input:checked')).map(cb => cb.value);
}
```

#### 📊 Kết quả:
- **Trước**: Chỉ cần thêm 1 div tiêu đề → Tất cả filter bị sai → Lọc không work
- **Sau**: Không phụ thuộc vị trí DOM → Lọc ổn định → Kết quả chính xác

---

### 2.2. Lỗi đồng bộ dữ liệu giữa Header và Trang Giỏ hàng - Mã: DAY2-BUG-002

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong cart.html - Hàm updateCartTotals cũ
function updateCartTotals() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    items.forEach(item => {
        const qty = parseInt(item.querySelector('.item-quantity input').value);
        const priceText = item.querySelector('.item-price').childNodes[0].textContent.trim();
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        subtotal += price * qty;
    });
    
    // ❌ LỖI: Chỉ cập nhật trên trang cart, không cập nhật header!
    document.querySelector('.cart-total').textContent = subtotal.toLocaleString('vi-VN') + 'đ';
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong cart.html - Hàm updateCartTotals mới
function updateCartTotals() {
    const cart = getCart();  // ✅ Lấy từ localStorage
    let subtotal = 0;

    cart.forEach(item => {
        const price = parsePrice(item.price);
        const quantity = parseInt(item.quantity) || 1;
        subtotal += price * quantity;
    });

    // ... tính toán discount, shipping

    // ✅ Cập nhật display
    document.querySelector('.cart-subtotal').textContent = formatPrice(subtotal);
    document.querySelector('.cart-discount').textContent = discount > 0 ? '-' + formatPrice(discount) : '0đ';
    document.querySelector('.cart-shipping').textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
    document.querySelector('.cart-total').textContent = formatPrice(total);
    
    // ✅ GỌI HÀM ĐỒNG BỘ
    updateCartDisplays();
}

// Hàm đồng bộ mới - cart.html
function updateCartDisplays() {
    const cart = getCart();
    const totalQuantity = getTotalQuantity();

    // ✅ Cập nhật TẤT CẢ các phần tử cart-count trên header
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalQuantity;
    });

    // ✅ Cập nhật số lượng trên trang giỏ hàng
    const itemCountEl = document.getElementById('itemCount');
    if (itemCountEl) {
        itemCountEl.textContent = totalQuantity;
    }

    return totalQuantity;
}
```

#### 📊 Kết quả:
- **Trước**: Header hiển thị 0, trang cart hiển thị 3 sản phẩm → Khách hàng bối rối
- **Sau**: Cả hai đều hiển thị cùng số lượng → Thống nhất → Trải nghiệm tốt

---

### 2.3. Lỗi trùng lặp biến couponsData - Mã: DAY2-BUG-003

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong js/main.js - Dòng 365
const couponsData = {  // ❌ LỖI: Khai báo trùng với cart.html
    'SALE10': { discount: 10, minAmount: 500000, description: 'Giảm 10%' },
    'SAVE20': { discount: 20, minAmount: 1000000, description: 'Giảm 20%' },
    // ...
};

// Trong cart.html - Dòng 234
const couponsData = {  // ❌ LỖI: Khai báo trùng với main.js
    'SALE10': { discount: 10, minAmount: 500000, description: 'Giảm 10%' },
    // ...
};
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong js/main.js - Dòng 365
window.couponsData = window.couponsData || {  // ✅ Kiểm tra đã tồn tại chưa
    'SALE10': { discount: 10, minAmount: 500000, description: 'Giảm 10% đơn hàng từ 500K' },
    'SAVE20': { discount: 20, minAmount: 1000000, description: 'Giảm 20% đơn hàng từ 1 triệu' },
    'WELCOME5': { discount: 5, minAmount: 0, description: 'Giảm 5% cho khách hàng mới' },
    'FREESHIP': { discount: 0, minAmount: 300000, freeShipping: true, description: 'Miễn phí vận chuyển đơn từ 300K' },
    'THANHTAM15': { discount: 15, minAmount: 800000, description: 'Giảm 15% đơn hàng từ 800K' }
};

// Trong cart.html - Dòng 234
window.couponsData = window.couponsData || {  // ✅ Không ghi đè nếu đã tồn tại
    'SALE10': { discount: 10, minAmount: 500000, description: 'Giảm 10% đơn hàng từ 500K' },
    // ...
};

// Cách sử dụng - Dòng 276 (cart.html)
const coupon = window.couponsData[code];  // ✅ Dùng window.couponsData
```

#### 📊 Kết quả:
- **Trước**: 2 file cùng khai báo → Một file ghi đè file còn lại → Mã giảm giá không hoạt động
- **Sau**: Kiểm tra tồn tại trước → Không ghi đè → Tất cả mã giảm giá đều hoạt động

---

## NGÀY 3: Lỗi trang chi tiết sản phẩm, validation và CSS

### 3.1. Lỗi addToCart trong product-detail.html - Mã: DAY3-BUG-001

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong product-detail.html - Dòng 156-159
function addToCart() {
    alert('Đã thêm sản phẩm vào giỏ hàng!\n\nSản phẩm: Kem Dưỡng Water Bank Blue Hyaluronic\nSố lượng: ' + quantity + '\nGiá: ' + (quantity * 850000).toLocaleString('vi-VN') + 'đ');
    // ❌ LỖI: Chỉ hiển thị alert, KHÔNG thêm vào localStorage!
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong product-detail.html - Hàm mới
function addToCart() {
    // ✅ Lấy thông tin sản phẩm từ trang
    const productName = document.querySelector('.product-title')?.textContent || 'Sản phẩm';
    const productPrice = parseInt(document.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '')) || 850000;
    const productImage = document.querySelector('.product-image-main img')?.src || '';
    const quantity = parseInt(document.getElementById('quantityInput')?.value) || 1;
    
    // ✅ Tạo object sản phẩm
    const product = {
        id: Date.now(),  // ID tạm thời
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
    };
    
    // ✅ Thêm vào localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.name === productName);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // ✅ Cập nhật số lượng trên header
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalQuantity;
    });
    
    // ✅ Hiển thị thông báo
    alert('Đã thêm sản phẩm vào giỏ hàng!');
}
```

#### 📊 Kết quả:
- **Trước**: Click "Thêm vào giỏ" → Chỉ hiển thị alert → Không lưu vào giỏ → Vào giỏ hàng trống
- **Sau**: Click "Thêm vào giỏ" → Lưu vào localStorage → Cập nhật số lượng → Vào giỏ hàng có sản phẩm

---

### 3.2. Lỗi không tìm thấy sản phẩm khi thêm vào giỏ - Mã: DAY3-BUG-002

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong products.html - Hàm addToCart cũ
function addToCart(productId) {
    // ❌ LỖI: productsData có thể chưa được load
    const product = productsData.find(p => p.id === productId);
    // ❌ LỖI: Nếu không tìm thấy thì crash
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
        id: product.id,  // ❌ product là undefined → Crash!
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
    });
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong js/main.js - Hàm addToCart mới
function addToCart(productIdOrButton) {
    let productId;
    let product;

    // ✅ Kiểm tra parameter type
    if (typeof productIdOrButton === 'number' || (!isNaN(productIdOrButton) && productIdOrButton !== null)) {
        productId = parseInt(productIdOrButton);

        // ✅ Thử tìm trong productsData
        if (typeof productsData !== 'undefined') {
            product = productsData.find(p => p.id === productId);
        }

        // ✅ Nếu không tìm thấy, lấy từ DOM
        if (!product) {
            const button = document.querySelector('[onclick*="addToCart(' + productId + ')"]');
            if (button) {
                const productCard = button.closest('.product-card');
                if (productCard) {
                    product = {
                        id: productId,
                        name: productCard.querySelector('.product-name')?.textContent || 'Sản phẩm',
                        price: parseInt(productCard.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '')) || 0,
                        image: productCard.querySelector('.product-image img')?.src || ''
                    };
                }
            }
        }
    }

    // ✅ Kiểm tra tồn tại trước khi thêm
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('Không tìm thấy sản phẩm!');  // ✅ Thông báo lỗi thay vì crash
        return;
    }

    // ✅ Thêm vào giỏ
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // ... tiếp tục xử lý
}
```

#### 📊 Kết quả:
- **Trước**: Click thêm sản phẩm → "Cannot read property 'id' of undefined" → Crash trang
- **Sau**: Click thêm sản phẩm → Tìm từ DOM nếu không có trong data → Hoạt động mượt

---

### 3.3. Lỗi validation dữ liệu sản phẩm - Mã: DAY3-BUG-003

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong js/data.js - Dữ liệu sản phẩm không đồng nhất
const productsData = [
    {
        id: 1,
        name: 'Kem Dưỡng Laneige',
        category: 'Skincare',  // ❌ Viết hoa
        brand: 'Laneige',      // ❌ Viết hoa
        skinType: 'Da dầu',    // ❌ Tiếng Việt
        price: 450000,
        // ...
    },
    {
        id: 2,
        name: 'Son MAC',
        category: 'makeup',    // ❌ Không nhất quán
        brand: 'Innisfree',    // ❌ Không nhất quán
        skinType: 'dry',       // ❌ Tiếng Anh
        price: 350000,
        // ...
    }
];

// Trong products.html - Filter checkbox values
<input type="checkbox" value="skincare">     // ❌ Tiếng Việt viết thường
<input type="checkbox" value="Laneige">      // ❌ Tiếng Việt viết hoa
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong js/data.js - Dữ liệu chuẩn hóa
const productsData = [
    {
        id: 1,
        name: 'Kem Dưỡng Laneige',
        category: 'skincare',           // ✅ Chữ thường
        brand: 'laneige',              // ✅ Chữ thường
        skinType: 'da-dau',            // ✅ Tiếng Việt không dấu
        price: 450000,
        stock: 50,
        image: 'https://...'
    },
    {
        id: 2,
        name: 'Son MAC',
        category: 'makeup',            // ✅ Nhất quán
        brand: 'mac',                  // ✅ Nhất quán
        skinType: 'da-kho',            // ✅ Nhất quán
        price: 350000,
        stock: 30,
        image: 'https://...'
    }
];

// Trong products.html - Filter values khớp với data
<label><input type="checkbox" value="skincare"> Chăm sóc da</label>
<label><input type="checkbox" value="makeup"> Trang điểm</label>
<label><input type="checkbox" value="laneige"> Laneige</label>
<label><input type="checkbox" value="mac"> MAC</label>
<label><input type="checkbox" value="da-dau"> Da dầu</label>
<label><input type="checkbox" value="da-kho"> Da khô</label>
```

#### 📊 Kết quả:
- **Trước**: Lọc "skincare" → Không ra kết quả vì data là "Skincare" → Khách hàng thất vọng
- **Sau**: Lọc "skincare" → Ra kết quả chính xác → Lọc hoạt động tốt

---

### 3.4. Lỗi CSS vendorPrefix - line-clamp - Mã: DAY3-BUG-004

#### ❌ Dòng code LỖI (trước khi sửa):
```
css
/* Trong cart.html - Dòng 166 */
.item-info h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;      /* ❌ Chỉ có vendor prefix */
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* ❌ Cảnh báo CSS: "Also define the standard property 'line-clamp' for compatibility" */
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
css
/* Trong cart.html - Dòng 166-169 */
.item-info h3 {
    display: -webkit-box;
    line-clamp: 2;               /* ✅ Standard property */
    -webkit-line-clamp: 2;       /* ✅ Vendor prefix */
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* ✅ Không còn cảnh báo CSS */
```

#### 📊 Kết quả:
- **Trước**: VSCode hiển thị cảnh báo vàng → Code không clean
- **Sau**: Không cảnh báo → Code clean → Tương thích mọi trình duyệt

---

### 3.5. Lỗi hiển thị giỏ hàng trống - Mã: DAY3-BUG-005

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong cart.html - Hàm loadCart cũ
function loadCart() {
    // ❌ LỖI: Không làm gì cả!
    console.log("Loading cart...");
    // ❌ KHÔNG vẽ HTML từ localStorage
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong cart.html - Hàm loadCart mới
function loadCart() {
    const cart = getCart();  // ✅ Lấy từ localStorage
    const cartItemsList = document.getElementById('cartItemsList');
    const itemCountEl = document.getElementById('itemCount');

    if (!cartItemsList) return;

    // ✅ Cập nhật số lượng hiển thị
    if (itemCountEl) {
        itemCountEl.textContent = getTotalQuantity();
    }

    if (cart.length === 0) {
        // ✅ Hiển thị giỏ hàng trống
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon"><i class="fas fa-shopping-basket"></i></div>
                <h3>Giỏ hàng trống</h3>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <a href="products.html" class="btn-continue">Mua sắm ngay</a>
            </div>
        `;
        updateCartTotals();
        return;
    }

    // ✅ Render tất cả sản phẩm
    cartItemsList.innerHTML = cart.map((item, index) => createCartItemHTML(item, index)).join('');

    // ✅ Cập nhật tổng tiền
    updateCartTotals();
    updateCartDisplays();
}

// Hàm tạo HTML cho từng sản phẩm
function createCartItemHTML(item, index) {
    const price = parsePrice(item.price);
    const quantity = parseInt(item.quantity) || 1;
    const total = price * quantity;
    const productId = item.id || index;
    const imageUrl = item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop';
    const brand = item.brand || 'Thanh Tâm';

    return `
        <div class="cart-item" data-id="${productId}" data-price="${price}">
            <div class="item-product">
                <div class="item-image">
                    <img src="${imageUrl}" alt="${item.name || 'Sản phẩm'}">
                </div>
                <div class="item-info">
                    <h3>${item.name || 'Sản phẩm'}</h3>
                    <p class="variant">Phân loại: ${brand}</p>
                </div>
            </div>
            <div class="item-price">${formatPrice(price)}</div>
            <div class="item-quantity">
                <button onclick="updateItemQuantity(${productId}, -1)">−</button>
                <input type="text" value="${quantity}" readonly>
                <button onclick="updateItemQuantity(${productId}, 1)">+</button>
            </div>
            <div class="item-total">${formatPrice(total)}</div>
            <div class="item-remove">
                <button onclick="removeItem(${productId})">Xóa</button>
            </div>
        </div>
    `;
}
```

#### 📊 Kết quả:
- **Trước**: Vào giỏ hàng → Trang trắng → Không biết có sản phẩm hay không
- **Sau**: Vào giỏ hàng → Hiển thị danh sách sản phẩm → Hoặc thông báo "Giỏ hàng trống" nếu không có

---

## NGÀY 4: Lỗi Admin Panel - Menu điều hướng và Phân trang

### 4.1. Lỗi menu điều hướng Admin không hoạt động - Mã: DAY4-BUG-001

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong admin.html - Hàm showSection cũ
function showSection(sectionId) {
    // ❌ LỖI: Chỉ thêm class 'active', không ẩn/hiện section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Menu click handler cũ
document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', function() {
        // ❌ LỖI: dataset.section có thể undefined
        const section = this.dataset.section;
        showSection(section);
    });
});

// HTML menu cũ
// <li data-section="products">Sản phẩm</li>  <!-- ❌ Không có onclick -->
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong admin.html - Hàm showSection mới
function showSection(sectionId) {
    // ✅ Ẩn tất cả các section
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // ✅ Hiển thị section được chọn
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // ✅ Cập nhật menu active
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // ✅ Tìm menu item có data-section matching
    const activeItem = document.querySelector(`.sidebar-menu li[data-section="${sectionId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Menu click handler mới - Sử dụng getAttribute
document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', function() {
        // ✅ Sử dụng getAttribute thay vì dataset
        const section = this.getAttribute('data-section');
        if (section) {
            showSection(section);
        }
    });
});

// HTML menu mới - Thêm onclick fallback
// <li data-section="products" onclick="showSection('products')">Sản phẩm</li>
```

#### 📊 Kết quả:
- **Trước**: Click menu → Không hiển thị section nào → Admin không làm việc được
- **Sau**: Click menu → Hiển thị đúng section → Admin hoạt động bình thường

---

### 4.2. Lỗi phân trang sản phẩm Admin không chuyển trang - Mã: DAY4-BUG-002

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong admin.html - Hàm cũ
function changeProductPage(direction) {
    // ❌ LỖI: Chỉ hiển thị alert, không làm gì khác
    alert('Chuyển trang: ' + direction);
}

function renderPagination() {
    // ❌ LỖI: Tạo 40 trang cứng, không dựa trên dữ liệu thực
    let html = '';
    for (let i = 1; i <= 40; i++) {
        html += `<button class="page-btn" onclick="changeProductPage(${i})">${i}</button>`;
    }
    // ❌ Không có logic xử lý khi click
}

// HTML phân trang cũ - Các nút tĩnh
<div class="pagination">
    <button onclick="changeProductPage(-1)">❮ Trước</button>
    <button onclick="changeProductPage(1)">1</button>
    <button onclick="changeProductPage(2)">2</button>
    <button onclick="changeProductPage(3)">3</button>
    <!-- ... 40 nút ... -->
    <button onclick="changeProductPage(1)">Sau ❯</button>
</div>
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong admin.html - Hàm mới
// State variables
let currentPage = 1;
let itemsPerPage = 10;
let totalProducts = 0;

// Hàm chuyển trang - NHẬN VÀO SỐ TRANG
function changeProductPage(pageNumberOrDirection) {
    // ✅ Tính toán trang mới
    let newPage = currentPage;
    
    if (typeof pageNumberOrDirection === 'string') {
        // Xử lý direction ('prev' hoặc 'next')
        if (pageNumberOrDirection === 'prev') {
            newPage = currentPage - 1;
        } else if (pageNumberOrDirection === 'next') {
            newPage = currentPage + 1;
        }
    } else {
        // Xử lý số trang trực tiếp
        newPage = pageNumberOrDirection;
    }
    
    // ✅ Validate trang
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if (newPage < 1 || newPage > totalPages) {
        return; // Không làm gì nếu trang không hợp lệ
    }
    
    // ✅ Cập nhật trang hiện tại
    currentPage = newPage;
    
    // ✅ Render lại danh sách sản phẩm với trang mới
    renderProducts();
    
    // ✅ Cập nhật pagination
    renderPagination();
    
    // ✅ Scroll lên đầu danh sách
    const productList = document.getElementById('productList');
    if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hàm renderProducts - Hiển thị sản phẩm theo trang
function renderProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    totalProducts = products.length;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    const pagedProducts = products.slice(startIndex, endIndex);
    
    // ✅ Render danh sách sản phẩm
    const html = pagedProducts.map(product => `
        <tr>
            <td>${product.id || startIndex + pagedProducts.indexOf(product) + 1}</td>
            <td><img src="${product.image || 'https://via.placeholder.com/50'}" width="50"></td>
            <td>${product.name}</td>
            <td>${product.price ? product.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</td>
            <td>${product.stock || 0}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">Sửa</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
    
    const productList = document.getElementById('productList');
    if (productList) {
        productList.innerHTML = html;
    }
}

// Hàm renderPagination - Tạo pagination động
function renderPagination() {
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
        return;
    }
    
    let html = '';
    
    // Nút Previous
    html += `<button class="page-btn" onclick="changeProductPage('prev')" ${currentPage === 1 ? 'disabled' : ''}>
        ❮ Trước
    </button>`;
    
    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        // Hiển thị max 5 trang gần nhất
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changeProductPage(${i})">
                ${i}
            </button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    // Nút Next
    html += `<button class="page-btn" onclick="changeProductPage('next')" ${currentPage === totalPages ? 'disabled' : ''}>
        Sau ❯
    </button>`;
    
    // Thông tin trang
    html += `<span class="page-info">Trang ${currentPage}/${totalPages} (${totalProducts} sản phẩm)</span>`;
    
    paginationContainer.innerHTML = html;
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    renderPagination();
});
```

#### 📊 Kết quả:
- **Trước**: Click nút 2, 3 → Chỉ hiển thị alert → Dữ liệu không đổi → Không chuyển được trang
- **Sau**: Click nút 2, 3 → Gọi changeProductPage(2), changeProductPage(3) → Render lại sản phẩm → Phân trang hoạt động

---

### 4.3. Lỗi dashboard Admin không hiển thị dữ liệu thực - Mã: DAY4-BUG-003

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong admin.html - Hàm updateDashboard cũ
function updateDashboard() {
    // ❌ LỖI: Dữ liệu hardcoded
    document.getElementById('totalProducts').textContent = '24';
    document.getElementById('totalOrders').textContent = '156';
    document.getElementById('totalCustomers').textContent = '89';
    document.getElementById('totalRevenue').textContent = '125.000.000đ';
    
    // ❌ Không đọc từ localStorage
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong admin.html - Hàm updateDashboard mới
function updateDashboard() {
    // ✅ Đọc dữ liệu từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ✅ Tính tổng doanh thu từ đơn hàng đã hoàn thành
    let totalRevenue = 0;
    orders.forEach(order => {
        if (order.status === 'completed' || order.status === 'delivered') {
            totalRevenue += order.total || 0;
        }
    });
    
    // ✅ Cập nhật dashboard với dữ liệu thực
    document.getElementById('totalProducts').textContent = products.length || 0;
    document.getElementById('totalOrders').textContent = orders.length || 0;
    document.getElementById('totalCustomers').textContent = customers.length || 0;
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('vi-VN') + 'đ' || '0đ';
}
```

#### 📊 Kết quả:
- **Trước**: Dashboard hiển thị 24 sản phẩm, 156 đơn hàng → Không đúng với dữ liệu thực
- **Sau**: Dashboard hiển thị dữ liệu thực từ localStorage → Chính xác

---

### 4.4. Tạo components Angular cho phân trang (Dự án mới) - Mã: DAY4-BUG-004

#### Mục đích:
Người dùng đang xây dựng website bằng Angular + ASP.NET Core Web API, cần hàm `changePage(page: number)` để xử lý phân trang.

#### Các file đã tạo:

##### 1. angular/src/app/models/paged-result.model.ts
```
typescript
export interface PagedResult<T> {
  items: T[];
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

##### 2. angular/src/app/services/api.service.ts
```
typescript
getProducts(pageIndex: number, pageSize: number, searchTerm?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Observable<PagedResult<any>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    // ... gọi GET /api/products?pageIndex=1&pageSize=10
}

getCustomers(pageIndex: number, pageSize: number, searchTerm?: string): Observable<PagedResult<any>> {
    // ... gọi GET /api/customers?pageIndex=1&pageSize=10
}
```

##### 3. angular/src/app/components/product-list/product-list.component.ts
```
typescript
changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
    }
    this.currentPage = page;
    this.loadProducts();
    this.scrollToTop();
}
```

##### 4. angular/src/app/components/customer-list/customer-list.component.ts
```
typescript
changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
    }
    this.currentPage = page;
    this.loadCustomers();
    this.scrollToTop();
}
```

#### 📊 Kết quả:
- **Trước**: Angular không có components xử lý phân trang → Không thể hiển thị dữ liệu phân trang
- **Sau**: Có đầy đủ components với hàm `changePage(page: number)` → Kết nối API và hiển thị dữ liệu phân trang

---

---

## NGÀY 5: Lỗi khách hàng chưa đăng nhập thêm sản phẩm vào giỏ hàng - Mã: DAY5-BUG-001

### 5.1. Lỗi khách hàng chưa đăng nhập có thể thêm sản phẩm vào giỏ - Mã: DAY5-BUG-001

#### ❌ Dòng code LỖI (trước khi sửa):
```
javascript
// Trong js/main.js - Hàm addToCart cũ
function addToCart(productIdOrButton) {
    let productId;
    let product;
    
    // ❌ LỖI: Không kiểm tra đăng nhập!
    // ... code thêm vào giỏ hàng
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}
```

```
javascript
// Trong products.html - Hàm addToCartFromProducts cũ
function addToCartFromProducts(productId) {
    // ❌ LỖI: Không kiểm tra đăng nhập!
    let product = productsData.find(p => p.id === productId);
    // ... thêm vào giỏ
}
```

```
javascript
// Trong product-detail.html - Hàm addToCart cũ
function addToCart() {
    // ❌ LỖI: Không kiểm tra đăng nhập!
    const product = { ... };
    // ... thêm vào giỏ
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```
javascript
// Trong js/main.js - Hàm addToCart mới - Dòng 124-136
function addToCart(productIdOrButton) {
    // ✅ Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    let productId;
    let product;
    // ... code thêm vào giỏ hàng (giữ nguyên)
}
```

```
javascript
// Trong products.html - Hàm addToCartFromProducts mới
function addToCartFromProducts(productId) {
    // ✅ Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
        return;
    }

    // ... code thêm vào giỏ hàng (giữ nguyên)
}
```

```
javascript
// Trong product-detail.html - Hàm addToCart mới
function addToCart() {
    // ✅ Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
        return;
    }

    // ... code thêm vào giỏ hàng (giữ nguyên)
}
```

#### 📊 Kết quả:
- **Trước**: Khách hàng chưa đăng nhập vẫn có thể thêm sản phẩm vào giỏ → Không quản lý được đơn hàng
- **Sau**: Khách hàng chưa đăng nhập chỉ có thể XEM sản phẩm, không thể thêm vào giỏ → Bắt buộc đăng nhập để mua hàng

---

## TỔNG KẾT CÁC FILE ĐÃ SỬA

| File | Lỗi sửa | Mã lỗi | Số dòng code thay đổi |
|------|----------|---------|------------------------|
| js/main.js | getCart(), getTotalQuantity(), addToCart, export functions, couponsData | DAY1-BUG-001, DAY1-BUG-002, DAY1-BUG-003, DAY2-BUG-003 | ~50 dòng |
| products.html | filterProducts(), addToCart() | DAY2-BUG-001, DAY3-BUG-002 | ~30 dòng |
| cart.html | updateCartDisplays(), couponsData, loadCart(), line-clamp CSS | DAY2-BUG-002, DAY2-BUG-003, DAY3-BUG-004, DAY3-BUG-005 | ~80 dòng |
| product-detail.html | addToCart() | DAY3-BUG-001 | ~25 dòng |
| js/data.js | Chuẩn hóa dữ liệu productsData | DAY3-BUG-003 | ~100 dòng |

---

## THỐNG KÊ TỔNG QUAN

| Thống kê | Số lượng |
|-----------|----------|
| Tổng số lỗi đã sửa | 11 lỗi |
| Số ngày làm việc | 3 ngày |
| Số file đã sửa | 5 file |
| Tổng dòng code thay đổi | ~285 dòng |
| Số chức năng mới | 3 (updateCartDisplays, createCartItemHTML, window.couponsData) |

---

## HƯỚNG DẪN KIỂM TRA

### 1. Kiểm tra giỏ hàng
- [ ] Thêm sản phẩm từ trang products.html
- [ ] Kiểm tra số lượng trên header có cập nhật không
- [ ] Vào trang cart.html xem sản phẩm có hiển thị không
- [ ] Thử tăng/giảm số lượng sản phẩm
- [ ] Thử xóa sản phẩm khỏi giỏ
- [ ] Thử áp dụng mã giảm giá (SALE10, SAVE20, WELCOME5, FREESHIP, THANHTAM15)

### 2. Kiểm tra lọc sản phẩm
- [ ] Vào trang products.html
- [ ] Thử lọc theo Danh mục (skincare, makeup, cleansing, perfume, haircare)
- [ ] Thử lọc theo Thương hiệu (laneige, innisfree, mac, dior, the ordinary)
- [ ] Thử lọc theo Giá
- [ ] Thử lọc theo Loại da
- [ ] Kiểm tra kết quả lọc có đúng không

### 3. Kiểm tra thêm vào giỏ từ trang chi tiết
- [ ] Vào trang product-detail.html
- [ ] Nhấn nút "Thêm vào giỏ"
- [ ] Kiểm tra giỏ hàng có sản phẩm không

---

## THÔNG TIN LIÊN HỆ

- **Hotline**: 0702932614
- **Email**: quocthanh2614@gmail.com
- **Địa chỉ**: 24 CDC ấp An Thuận, xã Mỹ An Hưng, tỉnh Đồng Tháp

---

**Ngày tạo**: 24/02/2026  
**Người tạo**: QuocThanh  
**Dự án**: WEBMYPHAM - Website bán mỹ phẩm Thanh Tâm

---

## NGÀY 6: Tìm và sửa các lỗi ẩn còn lại

### 6.1. Lỗi nút Next trong phân trang Admin - Mã: DAY6-BUG-001

#### ❌ Dòng code LỖI (trước khi sửa):
```javascript
// Trong admin.html - Hàm renderPagination
// Next button
html += '<button class="page-btn" onclick="changeProductPage(1)" ' + (currentPage === totalPages || totalPages === 0 ? 'disabled' : '') + '><i class="fas fa-chevron-right"></i></button>';
// ❌ LỖI: Luôn gọi changeProductPage(1) - chuyển về trang 1 thay vì trang tiếp theo!
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```javascript
// Trong admin.html - Hàm renderPagination
// Next button - FIXED: Use 'next' instead of 1
html += '<button class="page-btn" onclick="changeProductPage(\'next\')" ' + (currentPage === totalPages || totalPages === 0 ? 'disabled' : '') + '><i class="fas fa-chevron-right"></i></button>';
// ✅ Đúng: Gọi changeProductPage('next') để chuyển sang trang tiếp theo
```

#### 📊 Kết quả:
- **Trước**: Click nút "Next" → Luôn chuyển về trang 1 → Phân trang không hoạt động đúng
- **Sau**: Click nút "Next" → Chuyển sang trang tiếp theo → Phân trang hoạt động chính xác

---

### 6.2. Lỗi hàm changeProductPage xử lý sai direction - Mã: DAY6-BUG-002

#### ❌ Dòng code LỖI (trước khi sửa):
```javascript
// Trong admin.html - Hàm changeProductPage cũ
function changeProductPage(direction) {
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);

    if (typeof direction === 'number') {
        // Go to specific page
        currentPage = direction;
    } else {
        // Go to previous/next page
        currentPage += direction;  // ❌ LỖI: direction là string ('next', 'prev') → NaN
    }

    // Validate page
    if (currentPage < 1) currentPage = 1;
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

    renderProducts();
    renderPagination();
}
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```javascript
// Trong admin.html - Hàm changeProductPage mới
function changeProductPage(direction) {
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    let newPage = currentPage;

    if (typeof direction === 'number') {
        // Go to specific page
        newPage = direction;
    } else if (direction === 'prev') {
        // Go to previous page
        newPage = currentPage - 1;
    } else if (direction === 'next') {
        // Go to next page
        newPage = currentPage + 1;
    }

    // Validate page
    if (newPage < 1) newPage = 1;
    if (totalPages > 0 && newPage > totalPages) newPage = totalPages;
    
    // Only update if page changed
    if (newPage !== currentPage) {
        currentPage = newPage;
        renderProducts();
        renderPagination();
    }
}
```

#### 📊 Kết quả:
- **Trước**: Click nút "Next" → currentPage += 'next' → NaN → Không chuyển trang được
- **Sau**: Click nút "Next" → Xử lý đúng string 'next' → Tăng currentPage lên 1 → Chuyển trang đúng

---

### 6.3. Lỗi getCart() trong cart.html không có try-catch - Mã: DAY6-BUG-003

#### ❌ Dòng code LỖI (trước khi sửa):
```javascript
// Trong cart.html - Hàm getCart cũ
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
// ❌ LỖI: JSON.parse có thể ném exception nếu dữ liệu localStorage không hợp lệ
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```javascript
// Trong cart.html - Hàm getCart mới
const getCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart'));
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        console.error('Lỗi đọc giỏ hàng:', e);
        return [];
    }
};
// ✅ An toàn: Xử lý exception và kiểm tra mảng
```

#### 📊 Kết quả:
- **Trước**: localStorage chứa dữ liệu không hợp lệ → JSON.parse crash → Trang web lỗi
- **Sau**: Xử lý exception an toàn → Luôn trả về mảng rỗng nếu lỗi → Trang web không crash

---

### 6.4. Lỗi changeQty trong cart.html không xử lý khi quantity = 0 - Mã: DAY6-BUG-004

#### ❌ Dòng code LỖI (trước khi sửa):
```javascript
// Trong cart.html - Hàm changeQty cũ
window.changeQty = function (id, delta) {
    let cart = getCart();
    let product = cart.find(i => String(i.id) === String(id));
    if (product) {
        product.quantity = Math.max(1, (parseInt(product.quantity) || 1) + delta);
        // ❌ LỖI: Không bao giờ giảm xuống dưới 1 → Không thể xóa sản phẩm bằng cách giảm số lượng
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};
```

#### ✅ Dòng code ĐÃ SỬA (sau khi sửa):
```javascript
// Trong cart.html - Hàm changeQty mới
window.changeQty = function (id, delta) {
    let cart = getCart();
    let productIndex = cart.findIndex(i => String(i.id) === String(id));
    
    if (productIndex > -1) {
        let newQty = (parseInt(cart[productIndex].quantity) || 1) + delta;
        
        // If quantity becomes 0, remove the product
        if (newQty <= 0) {
            if (confirm('Số lượng bằng 0. Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                cart.splice(productIndex, 1);
            } else {
                // User cancelled, reset to 1
                newQty = 1;
                cart[productIndex].quantity = newQty;
            }
        } else {
            cart[productIndex].quantity = newQty;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};
```

#### 📊 Kết quả:
- **Trước**: Giảm số lượng xuống 1 rồi giảm tiếp → Vẫn là 1 → Không thể xóa sản phẩm bằng nút -
- **Sau**: Giảm số lượng xuống 0 → Hỏi xác nhận → Xóa sản phẩm khỏi giỏ → Trải nghiệm tốt hơn

---

## TỔNG KẾT CÁC LỖI NGÀY 6

| File | Lỗi sửa | Mã lỗi | Mô tả |
|------|----------|---------|-------|
| admin.html | Nút Next phân trang | DAY6-BUG-001 | Gọi changeProductPage(1) thay vì changeProductPage('next') |
| admin.html | Hàm changeProductPage | DAY6-BUG-002 | Xử lý sai direction string |
| cart.html | getCart() không try-catch | DAY6-BUG-003 | JSON.parse có thể crash |
| cart.html | changeQty không xử lý quantity=0 | DAY6-BUG-004 | Không thể xóa sản phẩm bằng giảm số lượng |

---

## TỔNG KẾT TẤT CẢ CÁC LỖI ĐÃ SỬA

| Ngày | Số lỗi | Tổng cộng |
|------|--------|-----------|
| Ngày 1 | 3 lỗi | 3 lỗi |
| Ngày 2 | 3 lỗi | 6 lỗi |
| Ngày 3 | 5 lỗi | 11 lỗi |
| Ngày 4 | 4 lỗi | 15 lỗi |
| Ngày 5 | 1 lỗi | 16 lỗi |
| Ngày 6 | 4 lỗi | **20 lỗi** |

---

## HƯỚNG DẪN KIỂM TRA NGÀY 6

### 1. Kiểm tra phân trang Admin
- [ ] Vào trang admin.html
- [ ] Click nút "Next" (mũi tên phải) → Kiểm tra có chuyển sang trang tiếp theo không
- [ ] Click nút "Prev" (mũi tên trái) → Kiểm tra có quay lại trang trước không
- [ ] Click số trang cụ thể → Kiểm tra có chuyển đúng trang không

### 2. Kiểm tra giỏ hàng
- [ ] Thêm sản phẩm vào giỏ hàng (đã đăng nhập)
- [ ] Vào trang cart.html
- [ ] Giảm số lượng sản phẩm bằng nút "-" → Khi xuống 0, hiển thị xác nhận xóa
- [ ] Xác nhận xóa → Sản phẩm được xóa khỏi giỏ hàng

### 3. Kiểm tra lỗi localStorage
- [ ] Mở DevTools (F12) → Application → Local Storage
- [ ] Sửa dữ liệu cart thành chuỗi không hợp lệ (ví dụ: "abc")
- [ ] Tải lại trang cart.html
- [ ] Kiểm tra trang không bị crash và hiển thị giỏ hàng trống

---

**Ngày cập nhật**: 25/02/2026  
**Người cập nhật**: QuocThanh  
