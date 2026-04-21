// Format price helper
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

// Load checkout data from localStorage
function loadCheckoutData() {
    try {
        const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
        if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0 || !checkoutData.total || checkoutData.total <= 0) {
            console.error('Invalid checkout data:', checkoutData);
            alert('Dữ liệu đơn hàng không hợp lệ (tổng tiền = 0)! Vui lòng quay lại giỏ hàng.');
            showEmptyCart();
            return null;
        } return checkoutData;
    } catch (e) {
        console.error('Lỗi đọc dữ liệu checkout:', e);
        showEmptyCart();
        return null;
    }
}

// Show empty cart state
function showEmptyCart() {
    const content = document.getElementById('checkoutContent');
    content.innerHTML = `
                <div class="empty-checkout" style="grid-column: 1 / -1;">
                    <div class="empty-checkout-icon"><i class="fas fa-shopping-basket"></i></div>
                    <h3>Giỏ hàng trống</h3>
                    <p>Không có sản phẩm nào để thanh toán</p>
                    <a href="products.html" class="btn-shop"><i class="fas fa-arrow-left"></i> Tiếp tục mua sắm</a>
                </div>
            `;
}

// Render order summary
function renderOrderSummary(checkoutData) {
    const itemsContainer = document.getElementById('summaryItems');
    const itemCountText = document.getElementById('itemCountText');

    if (!checkoutData || !checkoutData.items || !checkoutData.total || checkoutData.total <= 0) {
        console.error('Cannot render summary - invalid total:', checkoutData?.total);
        return;
    }

    const { items, subtotal, discount, shipping, total } = checkoutData;

    // Update item count
    const totalQty = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    itemCountText.textContent = `${totalQty} sản phẩm`;

    // Render items
    itemsContainer.innerHTML = items.map(item => `
                <div class="summary-item">
                    <div class="summary-item-image">
                        <img src="${item.image || 'images/logo/bbia.jpeg'}" alt="${item.name}">
                    </div>
                    <div class="summary-item-info">
                        <h4>${item.name}</h4>
                        <span class="item-qty">SL: ${item.quantity}</span>
                    </div>
                    <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                </div>
            `).join('');

    // Update totals
    document.querySelector('.cart-subtotal').textContent = formatPrice(subtotal);
    document.querySelector('.cart-discount').textContent = discount > 0 ? '-' + formatPrice(discount) : '0đ';

    const shippingText = (shipping === 0 && subtotal > 0) ? 'Miễn phí' : formatPrice(shipping);
    document.querySelector('.cart-shipping').textContent = shippingText;

    document.querySelector('.cart-total').textContent = formatPrice(total);
}

// Toggle VNPay container (global)
window.toggleVNPayContainer = function (show) {
    const vnpayContainer = document.getElementById('vnpay-container');
    const vnpayLabel = document.getElementById('label_vnpay');
    const codLabel = document.querySelector('.payment-option');

    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    if (show) {
        if (vnpayLabel) vnpayLabel.classList.add('active');
        if (vnpayContainer) vnpayContainer.classList.add('show');
    } else {
        if (codLabel) codLabel.classList.add('active');
        if (vnpayContainer) vnpayContainer.classList.remove('show');
    }
};

// Field error helper
function showFieldError(input) {
    input.classList.add('field-shake');
    input.classList.add('error');
    input.focus();
    setTimeout(() => input.classList.remove('field-shake'), 320);
}

// Order form validation
function validateOrderForm() {
    const requiredFields = [
        document.getElementById('customerName'),
        document.getElementById('customerPhone'),
        document.getElementById('customerAddress')
    ];
    let valid = true;

    requiredFields.forEach(field => {
        if (!field || !field.value.trim()) {
            valid = false;
            showFieldError(field);
        } else {
            field.classList.remove('error');
        }
    });

    const phoneInput = document.getElementById('customerPhone');
    const phoneValue = phoneInput.value.trim().replace(/\s+/g, '');
    const phoneRegex = /^(0[3-9])[0-9]{8}$/;
    if (phoneValue && !phoneRegex.test(phoneValue)) {
        valid = false;
        showFieldError(phoneInput);
        alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam.');
    }

    return valid;
}

// VNPay handler moved to js/payment.js
// Keep DOM/rendering functions only


// Form validation (COD/general)
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        if (!value) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    // Validate phone
    const phoneInput = document.getElementById('customerPhone');
    const phoneValue = phoneInput.value.trim().replace(/\s/g, '');
    const phoneRegex = /^(0[3-9])[0-9]{8}$/;
    if (phoneValue && !phoneRegex.test(phoneValue)) {
        phoneInput.classList.add('error');
        alert('Số điện thoại không hợp lệ!');
        isValid = false;
    }

    return isValid;
}

// Handle checkout submission (COD flow)
window.handleCheckout = function (event) {
    event.preventDefault();

    if (!validateForm()) {
        const firstError = document.querySelector('.form-group input.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    const customerInfo = {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        note: document.getElementById('orderNote').value.trim(),
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    const checkoutData = loadCheckoutData();
    if (!checkoutData) {
        alert('Không có sản phẩm để đặt hàng!');
        return;
    }

    const loggedInUserId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const order = {
        orderId: 'TT' + Date.now(),
        customerName: customerInfo.name,
        customerId: loggedInUserId,
        customerEmail: userEmail || customerInfo.email,
        customerInfo: customerInfo,
        items: checkoutData.items,
        subtotal: checkoutData.subtotal,
        discount: checkoutData.discount,
        shipping: checkoutData.shipping,
        total: checkoutData.total,
        couponCode: checkoutData.couponCode,
        orderDate: new Date().toISOString(),
        status: 'pending'
    };

    if (customerInfo.paymentMethod === 'vnpay') {
        window.handleVNPayPayment();
        return;
    }

    // COD: Save to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    adminOrders.push(order);
    localStorage.setItem('adminOrders', JSON.stringify(adminOrders));

    handleCustomerOrder(customerInfo, order.total);

    // Clear cart
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('checkoutData');
    localStorage.removeItem('couponCode');
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = '0');

    alert('🎉 Đặt hàng COD thành công!\nMã đơn: ' + order.orderId + '\nChúng tôi sẽ liên hệ xác nhận.');
    setTimeout(() => window.location.href = 'index.html', 3000);
};

// Customer management
function handleCustomerOrder(customerInfo, orderTotal) {
    let customers = JSON.parse(localStorage.getItem('customers') || '[]');

    const normalizedPhone = customerInfo.phone.replace(/\s/g, '').replace(/-/g, '');
    const normalizedEmail = customerInfo.email ? customerInfo.email.toLowerCase().trim() : '';

    const existingCustomerIndex = customers.findIndex(c => {
        const cPhone = c.phone ? c.phone.replace(/\s/g, '').replace(/-/g, '') : '';
        const cEmail = c.email ? c.email.toLowerCase().trim() : '';
        return cPhone === normalizedPhone || (normalizedEmail && cEmail === normalizedEmail);
    });

    if (existingCustomerIndex > -1) {
        customers[existingCustomerIndex].totalOrders = (customers[existingCustomerIndex].totalOrders || 0) + 1;
        customers[existingCustomerIndex].totalSpent = (customers[existingCustomerIndex].totalSpent || 0) + orderTotal;
        customers[existingCustomerIndex].lastOrderDate = new Date().toISOString();
    } else {
        customers.push({
            id: 'KH' + Date.now(),
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email,
            address: customerInfo.address,
            totalOrders: 1,
            totalSpent: orderTotal,
            status: 'active',
            createdAt: new Date().toISOString()
        });
    }

    localStorage.setItem('customers', JSON.stringify(customers));
}

// Copy transfer code (banking)
function copyTransferCode() {
    const code = document.getElementById('transfer-code')?.innerText;
    if (code) {
        navigator.clipboard.writeText(code).then(() => alert('Đã sao chép!'));
    }
}

// Init
document.addEventListener('DOMContentLoaded', function () {
    const checkoutData = loadCheckoutData();
    if (checkoutData) {
        renderOrderSummary(checkoutData);
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) document.getElementById('customerEmail').value = userEmail;
    }

    // 🔥 AUTO-FILL USER INFO FROM DB
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetchUserAndFillForm(userId);
    }

    // Admin confirm button fix
    const confirmCheck = document.getElementById('check-confirm-order');
    const btnOrder = document.getElementById('btn-confirm-paid');
    if (confirmCheck && btnOrder) {
        btnOrder.disabled = true;
        btnOrder.style.opacity = "0.5";
        confirmCheck.addEventListener('change', function () {
            btnOrder.disabled = !this.checked;
            btnOrder.style.opacity = this.checked ? "1" : "0.5";
            if (this.checked) btnOrder.style.background = "#e91e63";
        });
    }
});

// 🔥 NEW: Fetch user from DB & auto-fill checkout form
async function fetchUserAndFillForm(userId) {
    try {
        const response = await fetch(`api/get_customer.php?id=${userId}`);
        const result = await response.json();

        if (result.success && result.customer) {
            const customer = result.customer;
            document.getElementById('customerName').value = customer.HoTen || '';
            document.getElementById('customerPhone').value = customer.SoDienThoai || '';
            document.getElementById('customerEmail').value = customer.Email || '';
            document.getElementById('customerAddress').value = customer.DiaChi || '';

            console.log('✅ Auto-filled user:', customer.HoTen);
        }
    } catch (error) {
        console.error('Auto-fill failed:', error);
    }
}
