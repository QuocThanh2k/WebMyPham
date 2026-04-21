/**
 * LocalStorage Utility Functions for Thanh Tâm Cosmetics
 * Handles persistent storage for Products and Orders to prevent data loss on F5
 */

// LocalStorage Keys
const STORAGE_KEYS = {
    PRODUCTS: 'adminProducts',
    ORDERS: 'adminOrders',
    CUSTOMERS: 'customers',
    COUPONS: 'coupons'
};

/**
 * Save Products to localStorage
 * Call this function whenever products are added or modified
 */
function saveProductsToLocal() {
    try {
        // Get products from current data source
        let products = [];

        // First check if productsData exists (from data.js)
        if (typeof productsData !== 'undefined' && productsData.length > 0) {
            products = [...productsData];
        }

        // Then check if there are any saved products in localStorage
        const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (savedProducts) {
            const parsedSaved = JSON.parse(savedProducts);
            // Merge saved products with data.js products (saved products take priority for updates)
            if (parsedSaved && parsedSaved.length > 0) {
                products = parsedSaved;
            }
        }

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        console.log('✅ Products saved to localStorage:', products.length, 'items');

        return true;
    } catch (error) {
        console.error('❌ Error saving products to localStorage:', error);
        return false;
    }
}

/**
 * Save Orders to localStorage
 * Call this function whenever orders are created or modified
 */
function saveOrdersToLocal() {
    try {
        let orders = [];

        // First check if ordersData exists (from data.js)
        if (typeof ordersData !== 'undefined' && ordersData.length > 0) {
            orders = [...ordersData];
        }

        // Then check if there are any saved orders in localStorage
        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (savedOrders) {
            const parsedSaved = JSON.parse(savedOrders);
            if (parsedSaved && parsedSaved.length > 0) {
                orders = parsedSaved;
            }
        }

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        console.log('✅ Orders saved to localStorage:', orders.length, 'items');

        return true;
    } catch (error) {
        console.error('❌ Error saving orders to localStorage:', error);
        return false;
    }
}

/**
 * Main function to save all data to localStorage
 * Call this whenever there are changes to products or orders
 */
function saveDataToLocal() {
    const productsSaved = saveProductsToLocal();
    const ordersSaved = saveOrdersToLocal();

    if (productsSaved && ordersSaved) {
        console.log('✅ All data saved to localStorage successfully');

        // Notify user if on admin page
        if (typeof showToast === 'function') {
            showToast('Đã lưu dữ liệu vào localStorage!', 'success');
        }

        return true;
    }

    return false;
}

/**
 * Load Products from localStorage
 * Returns products from localStorage if available, otherwise returns default from data.js
 */
function loadProductsFromLocal() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                console.log('📂 Products loaded from localStorage:', parsed.length, 'items');
                return parsed;
            }
        }

        // Fallback to data.js if no saved data
        if (typeof productsData !== 'undefined' && productsData.length > 0) {
            console.log('📂 Products loaded from data.js (default):', productsData.length, 'items');
            return [...productsData];
        }

        console.log('📂 No products found');
        return [];
    } catch (error) {
        console.error('❌ Error loading products from localStorage:', error);

        // Fallback to data.js on error
        if (typeof productsData !== 'undefined') {
            return [...productsData];
        }
        return [];
    }
}

/**
 * Load Orders from localStorage
 * Returns orders from localStorage if available, otherwise returns default from data.js
 */
function loadOrdersFromLocal() {
    try {
        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);

        if (savedOrders) {
            const parsed = JSON.parse(savedOrders);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                console.log('📂 Orders loaded from localStorage:', parsed.length, 'items');
                return parsed;
            }
        }

        // Fallback to data.js if no saved data
        if (typeof ordersData !== 'undefined' && ordersData.length > 0) {
            console.log('📂 Orders loaded from data.js (default):', ordersData.length, 'items');
            return [...ordersData];
        }

        console.log('📂 No orders found');
        return [];
    } catch (error) {
        console.error('❌ Error loading orders from localStorage:', error);

        // Fallback to data.js on error
        if (typeof ordersData !== 'undefined') {
            return [...ordersData];
        }
        return [];
    }
}

/**
 * Main function to load all data from localStorage
 * Call this on DOMContentLoaded to initialize data
 */
function loadDataFromLocal() {
    const products = loadProductsFromLocal();
    const orders = loadOrdersFromLocal();

    console.log('📂 All data loaded from localStorage:', {
        products: products.length,
        orders: orders.length
    });

    // If this is the first time (no data in localStorage), save default data
    const hasLocalProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const hasLocalOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);

    if (!hasLocalProducts && products.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    if (!hasLocalOrders && orders.length > 0) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }

    return {
        products,
        orders
    };
}

/**
 * 🔥 FIXED: Enhanced initLocalStorage() - Auto-seed adminOrders + customers from data.js
 * Called on DOMContentLoaded for admin pages
 */
function initLocalStorage() {
    console.log('🚀 Initializing localStorage with ordersData seeding...');

    // Load & seed all data
    const data = loadDataFromLocal();

    // SEED CUSTOMERS if missing (for complete admin dashboard + profile features)
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
        const sampleCustomers = [
            {
                id: 1,
                name: "Đinh Quốc Thanh",
                email: "quocthanh2614@gmail.com",
                phone: "0901234567",
                totalOrders: 5,
                totalSpent: 5500000,  // Thân thiết level
                points: 5500,
                status: "Hoạt động",
                lastOrderDate: "2026-04-08",
                membership: "Khách hàng thân thiết"
            },
            {
                id: 2,
                name: "Nguyễn Văn Minh",
                email: "minh.nguyen@email.com",
                phone: "0912345678",
                totalOrders: 12,
                totalSpent: 8500000,
                points: 8500,
                status: "Hoạt động",
                lastOrderDate: "2026-04-07",
                membership: "VIP"
            },
            {
                id: 3,
                name: "Trần Thị Lan",
                email: "lan.tran@email.com",
                phone: "0987654321",
                totalOrders: 8,
                totalSpent: 5200000,
                points: 5200,
                status: "Hoạt động",
                lastOrderDate: "2026-04-06",
                membership: "Khách hàng thân thiết"
            }
        ];
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sampleCustomers));
        console.log('✅ Seeded 3 sample customers with points/membership');
    }

    // SEED ADDRESSES (user-specific)
    if (!localStorage.getItem('userAddresses')) {
        const mockAddresses = {
            "quocthanh2614@gmail.com": [
                {
                    id: 1,
                    name: "Nhà riêng - Thanh",
                    phone: "0901234567",
                    province: "Hà Nội",
                    district: "Hoàn Kiếm",
                    detail: "123 Hàng Bạc, Phố cổ",
                    isDefault: true
                },
                {
                    id: 2,
                    name: "Cơ quan",
                    phone: "0702932614",
                    province: "Hà Nội",
                    district: "Ba Đình",
                    detail: "Số 1 Hoàng Diệu",
                    isDefault: false
                }
            ],
            "minh.nguyen@email.com": [
                {
                    id: 1,
                    name: "Nhà Minh",
                    phone: "0912345678",
                    province: "TP.HCM",
                    district: "Quận 1",
                    detail: "45 Lê Lợi, P.Bến Nghé",
                    isDefault: true
                }
            ]
        };
        localStorage.setItem('userAddresses', JSON.stringify(mockAddresses));
        console.log('✅ Seeded mock addresses');
    }

    // SEED VOUCHERS (global, user-redeemable)
    if (!localStorage.getItem('vouchers')) {
        const mockVouchers = [
            { code: "TT50K", discount: 50000, minOrder: 300000, expiry: "2026-12-31", usesLeft: 100 },
            { code: "THANH100", discount: 100000, minOrder: 500000, expiry: "2026-06-30", usesLeft: 50 },
            { code: "VIP20", discount: 0.2, minOrder: 1000000, expiry: "2026-12-31", usesLeft: 20 }
        ];
        localStorage.setItem('vouchers', JSON.stringify(mockVouchers));
        console.log('✅ Seeded mock vouchers');
    }

    // Auto-init admin UI on admin pages
    if (document.querySelector('.admin-wrapper')) {
        console.log('🛠️ Admin page detected - Auto updating stats & tables');
        setTimeout(() => {
            if (typeof updateAllStats === 'function') updateAllStats();
            if (typeof renderAdminTables === 'function') renderAdminTables();
        }, 500);  // Delay for DOM ready
    }

    console.log('✅ localStorage initialized:', {
        products: data.products.length,
        orders: data.orders.length
    });

    return data;
}

/**
 * Check if data exists in localStorage
 */
function hasLocalData() {
    const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);

    return {
        hasProducts: products && JSON.parse(products).length > 0,
        hasOrders: orders && JSON.parse(orders).length > 0
    };
}

/**
 * Clear all stored data
 * Use this for resetting the system for a new business period
 * Shows confirmation dialog before clearing
 */
function clearAllData() {
    // Show confirmation dialog
    const confirmClear = confirm('⚠️ CẢNH BÁO!\n\n' +
        'Bạn có chắc chắn muốn XÓA SẠCH tất cả dữ liệu?\n\n' +
        'Hành động này sẽ xóa:\n' +
        '- Tất cả sản phẩm\n' +
        '- Tất cả đơn hàng\n' +
        '- Tất cả khách hàng\n\n' +
        'Dữ liệu sẽ được khôi phục về mặc định từ data.js\n\n' +
        'Nhập "XAC_NHAN" để xác nhận:');

    if (confirmClear) {
        const manualConfirm = prompt('Nhập "XAC_NHAN" để xác nhận xóa dữ liệu:');

        if (manualConfirm === 'XAC_NHAN') {
            try {
                // Clear all data from localStorage
                localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
                localStorage.removeItem(STORAGE_KEYS.ORDERS);
                localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
                localStorage.removeItem(STORAGE_KEYS.COUPONS);

                console.log('✅ All data cleared from localStorage');

                // Show success message
                alert('✅ Đã xóa sạch tất cả dữ liệu!\n\nDữ liệu sẽ được khôi phục về mặc định từ data.js');

                // Reload the page to refresh data
                window.location.reload();

                return true;
            } catch (error) {
                console.error('❌ Error clearing data:', error);
                alert('❌ Lỗi khi xóa dữ liệu: ' + error.message);
                return false;
            }
        } else if (manualConfirm !== null) {
            alert('❌ Mã xác nhận không đúng. Hủy thao tác.');
            return false;
        }
    }

    return false;
}

/**
 * Export data to JSON file (for backup)
 */
function exportDataToJSON() {
    const data = {
        products: loadProductsFromLocal(),
        orders: loadOrdersFromLocal(),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `thanh-tam-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Data exported to JSON');
    alert('✅ Đã xuất dữ liệu ra file JSON!');

    return true;
}

/**
 * Task #2: Update all admin stats (sidebar badges + dashboard counts)
 */
function updateAllStats() {
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const products = window.productsData || [];

    // Cập nhật Badge trên Sidebar (Khớp ID với HTML)
    const orderBadge = document.getElementById('orderCount');
    const customerBadge = document.getElementById('customerCount');

    if (orderBadge) orderBadge.innerText = orders.length;
    if (customerBadge) customerBadge.innerText = customers.length;

    // Cập nhật trên Dashboard (Khớp ID với image_7a5120.png)
    const dashOrder = document.getElementById('today-orders');
    const dashCustomer = document.getElementById('new-customers');
    const dashProduct = document.getElementById('total-products');

    if (dashOrder) dashOrder.innerText = orders.length;
    if (dashCustomer) dashCustomer.innerText = customers.length;
    if (dashProduct) dashProduct.innerText = products.length;
}

/**
 * Task #3: Render admin tables (orders + customers)
 */
function renderAdminTables() {
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    const orderTable = document.getElementById('ordersTable');

    if (orderTable && orders.length > 0) {
        orderTable.innerHTML = orders.map(order => `
            <tr>
                <td><strong>${order.id || 'N/A'}</strong></td>
                <td>${order.customerName || 'Khách vãng lai'}</td>
                <td>${order.productCount || 0} sản phẩm</td>
                <td><strong>${formatPrice(order.totalPrice || 0)}</strong></td>
                <td><span class="status-pending">${order.status || 'Chờ xử lý'}</span></td>
                <td>${formatDate(order.date)}</td>
                <td><button class="action-btn view" onclick="viewOrderDetail('${order.id || ''}')">Sửa</button></td>
            </tr>
        `).join('');
    } else if (orderTable) {
        orderTable.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;"><i class="fas fa-shopping-cart fa-2x" style="color:#9ca3af;"></i><br>Chưa có đơn hàng</td></tr>';
    }

    // Customers table (unchanged)
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customerTable = document.getElementById('customersTable');
    if (customerTable && customers.length > 0) {
        customerTable.innerHTML = customers.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.totalOrders}</td>
                <td>${c.totalSpent.toLocaleString()}đ</td>
                <td><span class="status-badge success">${c.status}</span></td>
                <td><button class="action-btn view" onclick="viewCustomer('${c.email}')">Xem</button></td>
            </tr>
        `).join('');
    } else if (customerTable) {
        customerTable.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;"><i class="fas fa-users fa-2x" style="color:#9ca3af;"></i><br>Chưa có khách hàng</td></tr>';
    }

    console.log('✅ Admin tables rendered');
}

// ✅ NEW: Format helpers for Admin tables (Thanh's spec)
function formatDate(dateStr) {
    if (!dateStr) return "---";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatPrice(num) {
    return (num || 0).toLocaleString() + 'đ';
}

// Export functions to window for global access
window.saveDataToLocal = saveDataToLocal;
window.loadDataFromLocal = loadDataFromLocal;
window.saveProductsToLocal = saveProductsToLocal;
window.saveOrdersToLocal = saveOrdersToLocal;
window.loadProductsFromLocal = loadProductsFromLocal;
window.loadOrdersFromLocal = loadOrdersFromLocal;
window.clearAllData = clearAllData;
window.hasLocalData = hasLocalData;
window.exportDataToJSON = exportDataToJSON;
window.initLocalStorage = initLocalStorage;
window.updateAllStats = updateAllStats;
window.renderAdminTables = renderAdminTables;
window.STORAGE_KEYS = STORAGE_KEYS;
window.formatDate = formatDate;
window.formatPrice = formatPrice;

