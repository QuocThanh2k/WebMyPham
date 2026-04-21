// Profile page protection
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Tab functions
function switchTab(tabName) {
    // 1. Ẩn tất cả nội dung tab
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 2. Bỏ trạng thái active của tất cả các nút tab
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Hiển thị tab được chọn (Tự động khớp ID)
    const targetTab = document.getElementById(tabName + 'Tab');
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);

    if (targetTab) {
        targetTab.classList.add('active');
    }
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    // 4. Xử lý các logic riêng biệt nếu cần
    if (tabName === 'orders') {
        loadUserOrders();
    } else if (tabName === 'addresses') {
        if (typeof loadUserAddresses === 'function') loadUserAddresses();
    } else if (tabName === 'loyalty') {
        if (typeof loadUserLoyalty === 'function') loadUserLoyalty();
    }

    // 5. Cuộn lên đầu phần nội dung
    const mainContent = document.querySelector('.profile-main');
    if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveUserInfo() {
    const name = document.getElementById('editUserName').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();

    if (name) {
        localStorage.setItem('userName', name);
        document.getElementById('profileUserName').textContent = name;
        updateUserDisplay(); // Update header too
    }

    if (phone) {
        localStorage.setItem('userPhone', phone);
        document.getElementById('profileUserPhone').textContent = phone;
    }

    showToast('Cập nhật thông tin thành công!', 'success');
}


// Utility functions (shared with orders page)
function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
}

function getStatusBadge(status) {
    const map = {
        'pending': { text: 'Chờ xử lý', class: 'warning' },
        'completed': { text: 'Hoàn thành', class: 'success' },
        'shipping': { text: 'Đang giao', class: 'info' },
        'cancelled': { text: 'Đã hủy', class: 'danger' }
    };
    const badge = map[status] || { text: status, class: 'warning' };
    return `<span class="status-badge ${badge.class}">${badge.text}</span>`;
}

function closeModal() {
    document.getElementById('orderDetailModal').classList.remove('active');
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Legacy function - now uses tabs
function showOrders() {
    switchTab('orders');
}


// Main init function
async function initProfile() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        logout();
        return;
    }

    // Load user info from customers (fallback to stored)
    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    let user = customers.find(c => c.email === userEmail);

    if (!user) {
        // Fallback to stored user
        user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

    // Update sidebar
    const userName = user.name || localStorage.getItem('userName') || 'Khách hàng';
    const userPhone = user.phone || localStorage.getItem('userPhone') || 'Chưa cập nhật';

    document.getElementById('profileUserName').textContent = userName;
    document.getElementById('profileUserEmail').textContent = user.email || userEmail;
    document.getElementById('profileUserPhone').textContent = userPhone;

    // Fill editable form
    document.getElementById('editUserName').value = userName;
    document.getElementById('editUserPhone').value = userPhone;

    // Default to orders tab
    switchTab('orders');

    updateUserDisplay(); // Update header
}

function loadUserOrders() {
    const userEmail = localStorage.getItem('userEmail');
    const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const userOrders = adminOrders.filter(order =>
        order.customerInfo && order.customerInfo.email === userEmail
    );

    const countEl = document.getElementById('ordersCount');
    countEl.textContent = userOrders.length === 0
        ? 'Chưa có đơn hàng nào'
        : `Tìm thấy ${userOrders.length} đơn hàng`;

    if (userOrders.length === 0) {
        document.getElementById('userOrdersTable').innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Chưa có đơn hàng</h3>
                    <p>Hãy đặt đơn hàng đầu tiên để xem lịch sử!</p>
                </td>
            </tr>
        `;
        return;
    }

    renderOrdersTable(userOrders);
}


function renderOrdersTable(orders) {
    const tbody = document.getElementById('userOrdersTable');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.orderId}</strong></td>
            <td>${order.ngayDat || new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
            <td>${order.items ? order.items.length : 0}</td>
            <td>${formatPrice(order.total)}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td><button class="btn-detail" onclick="viewOrderDetail('${order.orderId}')">Xem chi tiết</button></td>
        </tr>
    `).join('');
}

// Mở modal và đổ dữ liệu Tỉnh/Thành
function openAddressModal() {
    document.getElementById('addressModal').classList.add('active');
    const provinceSelect = document.getElementById('addrProvince');

    // Đổ dữ liệu từ VN_PROVINCES vào select
    provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành</option>' +
        VN_PROVINCES.map(p => `<option value="${p.code}">${p.name}</option>`).join('');
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.remove('active');
    document.getElementById('addressForm').reset();
}

/// Hàm mới: Chọn Tỉnh xong hiện thẳng Phường/Xã
function updateWardOptionsDirect() {
    const provinceCode = document.getElementById('addrProvince').value;
    const wardSelect = document.getElementById('addrWard');

    // Tìm tỉnh tương ứng trong mảng dữ liệu
    const province = VN_PROVINCES.find(p => p.code === provinceCode);

    // Xóa danh sách cũ
    wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';

    if (province && province.districts) {
        let allWards = [];

        // Gom tất cả wards từ các quận/huyện vào một mảng duy nhất
        province.districts.forEach(d => {
            if (d.wards && Array.isArray(d.wards)) {
                allWards = allWards.concat(d.wards);
            }
        });

        // Sắp xếp theo bảng chữ cái cho chuyên nghiệp
        allWards.sort((a, b) => a.localeCompare(b));

        // Đổ dữ liệu vào ô Select
        if (allWards.length > 0) {
            wardSelect.innerHTML += allWards.map(w =>
                `<option value="${w}">${w}</option>`
            ).join('');
        }
    }
}

function handleSaveAddress(event) {
    event.preventDefault();
    const email = localStorage.getItem('userEmail');

    const newAddr = {
        id: Date.now(),
        name: document.getElementById('addrName').value,
        phone: document.getElementById('addrPhone').value,
        province: document.getElementById('addrProvince').options[document.getElementById('addrProvince').selectedIndex].text,
        ward: document.getElementById('addrWard').value,
        detail: document.getElementById('addrDetail').value,
        isDefault: false
    };

    let allAddresses = JSON.parse(localStorage.getItem('userAddresses') || '{}');
    if (!allAddresses[email]) allAddresses[email] = [];

    allAddresses[email].push(newAddr);
    localStorage.setItem('userAddresses', JSON.stringify(allAddresses));

    closeAddressModal();
    loadUserAddresses();
}

// Đừng quên thêm sự kiện onchange cho select Quận trong HTML:
// <select id="addrDistrict" onchange="updateWardOptions()" required>...</select>

// Lưu địa chỉ vào LocalStorage
function handleSaveAddress(event) {
    event.preventDefault();
    const email = localStorage.getItem('userEmail');
    const newAddr = {
        id: Date.now(),
        name: document.getElementById('addrName').value,
        phone: document.getElementById('addrPhone').value,
        province: document.getElementById('addrProvince').options[document.getElementById('addrProvince').selectedIndex].text,
        district: document.getElementById('addrDistrict').value,
        detail: document.getElementById('addrDetail').value,
        isDefault: false
    };

    let allAddresses = JSON.parse(localStorage.getItem('userAddresses') || '{}');
    if (!allAddresses[email]) allAddresses[email] = [];

    allAddresses[email].push(newAddr);
    localStorage.setItem('userAddresses', JSON.stringify(allAddresses));

    closeAddressModal();
    loadUserAddresses(); // Cập nhật lại danh sách hiển thị
    showToast('Đã thêm địa chỉ mới!', 'success');
}

// Render danh sách địa chỉ ra màn hình
function loadUserAddresses() {
    const email = localStorage.getItem('userEmail');
    const addresses = JSON.parse(localStorage.getItem('userAddresses') || '{}')[email] || [];
    const listEl = document.getElementById('addressList');

    if (addresses.length === 0) {
        listEl.innerHTML = '<p class="empty-state">Bạn chưa có địa chỉ nào.</p>';
        return;
    }

    listEl.innerHTML = addresses.map(addr => `
        <div class="address-card" style="border: 1px solid #eee; padding: 15px; border-radius: 10px; margin-bottom: 15px; position: relative;">
            <h4 style="color: var(--primary-color);">${addr.name}</h4>
            <p><strong>SĐT:</strong> ${addr.phone}</p>
            <p><strong>Địa chỉ:</strong> ${addr.detail}, ${addr.district}, ${addr.province}</p>
            <button onclick="deleteAddress(${addr.id})" style="position: absolute; top: 10px; right: 10px; color: red; border: none; background: none; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteAddress(id) {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    const email = localStorage.getItem('userEmail');
    let allAddresses = JSON.parse(localStorage.getItem('userAddresses') || '{}');
    allAddresses[email] = allAddresses[email].filter(a => a.id !== id);
    localStorage.setItem('userAddresses', JSON.stringify(allAddresses));
    loadUserAddresses();
}

function viewOrderDetail(orderId) {
    const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const order = adminOrders.find(o => o.orderId === orderId);

    if (!order) {
        alert('Không tìm thấy đơn hàng!');
        return;
    }

    // Populate modal
    document.getElementById('modalOrderId').textContent = `Đơn hàng #${order.orderId}`;

    // Products
    const productsHtml = (order.items || []).map(item => `
        <div class="product-item">
            <img src="${item.image || 'images/SP/C001.jpg'}" alt="${item.name}" class="product-image">
            <div class="product-details">
                <strong>${item.name}</strong><br>
                <small>Số lượng: ${item.quantity || 1} × ${formatPrice(item.price || 0)}</small>
            </div>
            <div style="font-weight: 600; color: #e11d48;">
                ${formatPrice((item.price || 0) * (item.quantity || 1))}
            </div>
        </div>
    `).join('') || '<p style="text-align:center;color:#6b7280;">Không có sản phẩm</p>';

    document.getElementById('modalProducts').innerHTML = productsHtml;

    // Customer info
    const customer = order.customerInfo || {};
    document.getElementById('modalCustomerInfo').innerHTML = `
        <h4><i class="fas fa-user"></i> Thông tin nhận hàng</h4>
        <p><strong>Tên:</strong> ${customer.name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
        <p><strong>Địa chỉ:</strong> ${customer.address || 'N/A'}</p>
        ${customer.note ? `<p><strong>Ghi chú:</strong> ${customer.note}</p>` : ''}
    `;

    // Total
    document.getElementById('modalTotal').innerHTML = `
        <div style="display:flex;justify-content:space-between;">
            <span>Tổng thanh toán:</span>
            <span>${formatPrice(order.total)}</span>
        </div>
        <div style="margin-top:8px;">
            ${getStatusBadge(order.status)}
        </div>
    `;

    // Show modal
    document.getElementById('orderDetailModal').classList.add('active');
}

// Update cart count (for header)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    });
}

// Init on DOM load
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    initProfile();
});
