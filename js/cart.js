// 1. Dữ liệu mã giảm giá (Hợp nhất từ cả 2 code)
window.couponsData = {
    'SALE10': { discount: 10, minAmount: 500000, desc: 'Giảm 10% đơn từ 500k' },
    'THANHTAM': { discount: 20, minAmount: 0, desc: 'Giảm 20% cho khách mới' },
    'THANHTAM15': { discount: 15, minAmount: 800000, desc: 'Giảm 15% đơn từ 800k' },
    'FREESHIP': { discount: 0, minAmount: 300000, freeShipping: true, desc: 'Freeship đơn từ 300k' }
};

// 2. Helpers
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

// FIXED: Safe getCart with try-catch
const getCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart'));
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        console.error('Lỗi đọc giỏ hàng:', e);
        return [];
    }
};

// 3. Cập nhật con số và UI
function updateTotals() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

    // Cập nhật số lượng trên icon và tiêu đề
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalQty);
    const itemCountEl = document.getElementById('itemCount');
    if (itemCountEl) itemCountEl.textContent = totalQty;

    // Xử lý giảm giá
    let coupon = JSON.parse(localStorage.getItem('appliedCoupon'));
    let discount = 0;
    let isFreeShip = false;

    if (coupon && subtotal >= coupon.minAmount) {
        discount = subtotal * ((coupon.discount || 0) / 100);
        if (coupon.freeShipping) isFreeShip = true;
    } else {
        localStorage.removeItem('appliedCoupon');
    }

    // Phí ship (Mặc định 30k, miễn phí từ 500k hoặc dùng mã FREESHIP)
    let shipping = (subtotal > 0 && subtotal < 500000 && !isFreeShip) ? 30000 : 0;

    document.querySelector('.cart-subtotal').textContent = formatPrice(subtotal);
    document.querySelector('.cart-discount').textContent = discount > 0 ? '-' + formatPrice(discount) : '0đ';
    document.querySelector('.cart-shipping').textContent = (shipping === 0 && subtotal > 0) ? 'Miễn phí' : formatPrice(shipping);
    document.querySelector('.cart-total').textContent = formatPrice(subtotal - discount + shipping);
}

// 4. Load sản phẩm
function loadCart() {
    const cart = getCart();
    const container = document.getElementById('cartItemsList');

    if (cart.length === 0) {
        container.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon"><i class="fas fa-shopping-basket"></i></div>
                        <h3>Giỏ hàng đang trống</h3>
                        <p>Hãy chọn cho mình những sản phẩm yêu thích nhé!</p>
                        <a href="products.html" class="btn-checkout" style="display:inline-block; width:auto; text-decoration:none;">MUA SẮM NGAY</a>
                    </div>`;
        updateTotals();
        return;
    }

    container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="item-product">
                        <div class="item-image"><img src="${item.image || 'img/default.jpg'}" alt="${item.name}"></div>
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="variant">Thương hiệu: ${item.brand || 'Thanh Tâm'}</p>
                        </div>
                    </div>
                    <div class="item-price">${formatPrice(item.price)}</div>
                    <div class="item-quantity">
                        <button onclick="changeQty('${item.id}', -1)">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                    <div class="item-total">${formatPrice(item.price * item.quantity)}</div>
                    <div class="item-remove"><button onclick="removeItem('${item.id}')">Xóa</button></div>
                </div>
            `).join('');

    updateTotals();
}

// 5. Các hàm thao tác (Gộp logic xác nhận và thông báo)
// FIXED: Handle quantity = 0 (remove product)
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

window.removeItem = function (id) {
    if (confirm('Xóa sản phẩm này khỏi giỏ hàng?')) {
        let cart = getCart().filter(i => String(i.id) !== String(id));
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};

window.clearAllCart = function () {
    if (confirm('Xóa toàn bộ giỏ hàng?')) {
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedCoupon');
        loadCart();
    }
};

window.applyCouponCode = function () {
    const code = document.getElementById('couponCode').value.toUpperCase().trim();
    const coupon = window.couponsData[code];
    const subtotal = getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (coupon) {
        if (subtotal < coupon.minAmount) {
            alert(`Mã này chỉ áp dụng cho đơn hàng từ ${formatPrice(coupon.minAmount)}`);
        } else {
            localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
            updateTotals();
            alert('Áp dụng mã giảm giá thành công!');
        }
    } else {
        alert('Mã giảm giá không hợp lệ!');
    }
};

window.processCheckout = function () {
    if (getCart().length === 0) return alert('Giỏ hàng trống!');

    // Giả lập check login
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để tiếp tục thanh toán');
        window.location.href = 'login.html';
        return;
    }

    // Lưu thông tin giỏ hàng vào localStorage để hiển thị ở trang checkout
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

    // Lấy thông tin coupon nếu có
    let coupon = JSON.parse(localStorage.getItem('appliedCoupon'));
    let discount = 0;
    let isFreeShip = false;

    if (coupon && subtotal >= coupon.minAmount) {
        discount = subtotal * ((coupon.discount || 0) / 100);
        if (coupon.freeShipping) isFreeShip = true;
    }

    // Tính phí ship (Miễn phí từ 500k)
    let shipping = (subtotal > 0 && subtotal < 500000 && !isFreeShip) ? 30000 : 0;

    // Tính tổng tiền
    const total = subtotal - discount + shipping;

    // Lưu checkout data vào localStorage
    const checkoutData = {
        items: cart,
        subtotal: subtotal,
        discount: discount,
        shipping: shipping,
        total: total,
        couponCode: coupon ? localStorage.getItem('couponCode') || '' : ''
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

    // Chuyển sang trang checkout
    window.location.href = 'checkout.html';
};

document.addEventListener('DOMContentLoaded', loadCart);
