
function loadOrders() {
    console.log('📦 Đang ép nạp dữ liệu Đơn hàng...');
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    const tbody = document.getElementById('ordersTable');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Chưa có đơn hàng</td></tr>';
        return;
    }

    // ÉP BUỘC: Đọc đúng thuộc tính orderId, customerName, total
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.orderId || 'HD' + Date.now()}</strong></td>
            <td>${order.customerName || 'Khách vãng lai'}</td>
            <td>${(order.items ? order.items.length : 0)} sản phẩm</td>
            <td><strong>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total || 0)}</strong></td>
            <td><span class="status-badge ${order.status === 'pending' ? 'warning' : 'success'}">${order.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}</span></td>
            <td>${order.ngayDat || '03/04/2026'}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewOrderDetail('${order.orderId}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" style="color: #10b981; background: #ecfdf5; border:none; padding:5px 8px; border-radius:4px;"><i class="fas fa-edit"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}



// =============================================================================
// GLOBAL INIT & EXPOSE - Keep existing dashboard/utils intact
// =============================================================================
window.customersData = window.customersData || [];
window.ordersData = window.ordersData || [];
window.productsData = window.productsData || [];

let blogEditor = null;

function initializeRealOrders() {
    const customers = ["Trần Thị Thanh Tâm", "Nguyễn Văn Bình", "Lê Hoàng Nam", "Phạm Minh Chúc", "Vũ Tuyết Mai", "Đinh Quốc Thanh"];
    const statuses = ["Hoàn thành", "Chờ xử lý", "Hoàn thành", "Đang giao", "Hoàn thành", "Hoàn thành", "Chờ xử lý", "Hoàn thành", "Đang giao", "Hoàn thành", "Đã hủy", "Hoàn thành", "Hoàn thành", "Đang giao", "Chờ xử lý", "Hoàn thành", "Hoàn thành", "Hoàn thành", "Chờ xử lý", "Hoàn thành"];
    const totals = [850000, 420000, 1250000, 680000, 350000, 2100000, 290000, 760000, 550000, 1420000, 890000, 450000, 920000, 1150000, 310000, 780000, 480000, 1350000, 250000, 820000];

    const mockOrders = Array.from({ length: 20 }, (_, i) => {
        const day = (30 - Math.floor(i / 2)).toString().padStart(2, '0');
        return {
            orderId: "HD" + (1001 + i),
            customerName: customers[i % customers.length],
            items: Array(Math.floor(Math.random() * 3) + 1).fill().map(() => 'SP' + Math.floor(Math.random() * 300)),
            total: totals[i],
            status: statuses[i],
            ngayDat: `${day}/03/2026`,
            orderDate: `2026-03-${day}T12:00:00Z`
        };
    });

    localStorage.setItem('adminOrders', JSON.stringify(mockOrders));
    console.log('✅ Đã tạo lại 20 đơn hàng mẫu với dữ liệu chính xác');
    return mockOrders;
}

if (!localStorage.getItem("products") || JSON.parse(localStorage.getItem("products")).length < 10) {
    if (typeof productsData !== 'undefined') {
        localStorage.setItem("products", JSON.stringify(productsData));
    }
}

window.onload = function () {
    console.log('🚀 Admin Dashboard initializing...');
    initializeRealOrders();
    if (typeof loadDashboardStats === 'function') loadDashboardStats();
    if (typeof loadTopProducts === 'function') loadTopProducts();
    loadOrders();
    if (typeof loadRecentOrders === 'function') loadRecentOrders();
    if (typeof loadCustomers === 'function') loadCustomers();

    if (typeof window.showSection === 'function') window.showSection('dashboard');

    const searchInput = document.getElementById('searchBlog');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const q = event.target.value || '';
            if (!q.trim()) {
                BLOG_SYSTEM.render();
            } else {
                if (typeof window.searchBlog === 'function') window.searchBlog();
            }
        });
    }
};


// UTILS - Keep existing if defined elsewhere
function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
}

function getStatusBadge(status) {
    const map = {
        'pending': 'warning',
        'Chờ xử lý': 'warning',
        'Hoàn thành': 'success',
        'completed': 'success'
    };
    return `<span class="status-badge ${map[status] || 'secondary'}">${status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}</span>`;
}

// ĐẶT BIẾN TOÀN CỤC ĐỂ ĐẢM BẢO KHÔNG BỊ TRÙNG
let editingId = null;
const BLOG_IMAGE_PLACEHOLDER = 'images/logo/logo_backup.png';

const BLOG_SYSTEM = {
    key: 'admin_blogs',
    defaultImage: BLOG_IMAGE_PLACEHOLDER,

    getBlogs: function () {
        const stored = localStorage.getItem(this.key);
        if (stored === null) {
            const sampleBlogs = this.createSampleBlogs();
            this.saveBlogs(sampleBlogs);
            return sampleBlogs;
        }
        const blogs = JSON.parse(stored || '[]');
        return Array.isArray(blogs) ? blogs : [];
    },

    saveBlogs: function (blogs) {
        localStorage.setItem(this.key, JSON.stringify(blogs));
    },

    getBlogById: function (id) {
        return this.getBlogs().find(b => b.id === id);
    },

    getProductLabel: function (blog) {
        const allProducts = JSON.parse(localStorage.getItem('products') || localStorage.getItem('adminProducts') || '[]');
        const product = (Array.isArray(allProducts) ? allProducts : []).find(p => p.id === blog.productId);
        if (product) return product.name;
        return blog.relatedProducts || blog.product || 'Không gắn';
    },

    createSampleBlogs: function () {
        const sampleData = [
            {
                title: 'Mẹo trang điểm đơn giản cho đôi mắt cuốn hút',
                image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=300&fit=crop',
                relatedProducts: 'Son môi',
                content: 'Hướng dẫn trang điểm mắt để tạo điểm nhấn tự nhiên, phù hợp mọi làn da và phong cách.',
            },
            {
                title: 'Cách dùng serum phục hồi da ban đêm đúng chuẩn',
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
                relatedProducts: 'Serum dưỡng da',
                content: 'Bước chăm sóc da ban đêm với serum giúp da sáng khỏe, mịn màng và giảm thâm hiệu quả.',
            },
            {
                title: 'Chăm sóc da khô mùa đông với sản phẩm dưỡng ẩm',
                image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
                relatedProducts: 'Kem dưỡng ẩm',
                content: 'Lựa chọn kem dưỡng ẩm phù hợp cho da khô và hướng dẫn cách sử dụng hàng ngày.',
            },
            {
                title: 'Thử ngay mặt nạ giấy để da căng bóng',
                image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop',
                relatedProducts: 'Mặt nạ',
                content: 'Giải pháp chăm sóc da nhanh chóng với mặt nạ giấy, hiệu quả tức thì cho làn da mệt mỏi.',
            },
            {
                title: 'Lựa chọn nước hoa phù hợp cho mọi dịp',
                image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
                relatedProducts: 'Nước hoa',
                content: 'Mẹo chọn nước hoa theo tính cách và hoàn cảnh để luôn tự tin mỗi ngày.',
            }
        ];
        return sampleData.map((item, index) => ({
            id: `blog_${Date.now()}_${index + 1}`,
            title: item.title,
            image: item.image,
            relatedProducts: item.relatedProducts,
            productId: '',
            content: item.content,
            date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
            views: 0
        }));
    },

    populateProductDropdown: function () {
        const savedProducts = JSON.parse(localStorage.getItem('products') || localStorage.getItem('adminProducts') || '[]');
        const select = document.getElementById('blogProduct');
        if (!select) return;
        select.innerHTML = '<option value="">Chọn sản phẩm</option>';
        (Array.isArray(savedProducts) ? savedProducts : []).forEach(product => {
            select.innerHTML += `<option value="${product.id}">${product.name}</option>`;
        });
    },

    closeModal: function () {
        editingId = null;
        const modal = document.getElementById('blogModal');
        if (modal) modal.classList.remove('active');
        const submitButton = document.getElementById('blogSubmitButton');
        if (submitButton) submitButton.innerHTML = '<i class="fas fa-save"></i> Đăng bài';
    },

    // 1. HÀM MỞ MODAL (ÉP BUỘC RESET)
    openModal: async function (editId = null) {
        console.log("🎯 Đang mở modal với ID:", editId);
        const modal = document.getElementById('blogModal');
        const idInput = document.getElementById('blogId');
        const submitButton = document.getElementById('blogSubmitButton');

        // Reset form sạch sẽ
        document.getElementById('blogForm').reset();
        this.populateProductDropdown();
        editingId = editId || null;
        idInput.value = editingId || '';

        if (!editingId) {
            document.getElementById('blogModalTitle').textContent = 'Viết bài mới';
            if (submitButton) submitButton.innerHTML = '<i class="fas fa-save"></i> Đăng bài';
            document.getElementById('blogDate').valueAsDate = new Date();
            if (window.blogEditor) window.blogEditor.setData('');
        } else {
            document.getElementById('blogModalTitle').textContent = 'Cập nhật bài viết';
            if (submitButton) submitButton.innerHTML = '<i class="fas fa-save"></i> Cập nhật';

            const blog = this.getBlogById(editingId);
            if (blog) {
                document.getElementById('blogTitle').value = blog.title || '';
                document.getElementById('blogImage').value = blog.image || '';
                document.getElementById('blogDate').value = blog.date || '';
                document.getElementById('blogProduct').value = blog.productId || '';
                if (window.blogEditor) window.blogEditor.setData(blog.content || '');
            }
        }

        if (modal) modal.classList.add('active');
    },


    // 2. HÀM LƯU (ÉP BUỘC PHÂN BIỆT THÊM/SỬA)
    save: function () {
        const title = document.getElementById('blogTitle').value.trim();
        const content = window.blogEditor ? window.blogEditor.getData() : document.getElementById('blogContent')?.value.trim() || '';
        const image = document.getElementById('blogImage').value.trim();
        const productId = document.getElementById('blogProduct').value;
        const dateValue = document.getElementById('blogDate').value || new Date().toISOString().split('T')[0];

        if (!title || !content) {
            alert('Vui lòng nhập Tiêu đề và Nội dung bài viết.');
            return;
        }

        let blogs = this.getBlogs();
        const blogData = {
            id: editingId || Date.now().toString(),
            title: title,
            image: image,
            productId: productId,
            relatedProducts: this.getProductLabel({ productId, relatedProducts: '' }),
            content: content,
            date: dateValue,
            views: editingId ? (blogs.find(b => b.id === editingId)?.views || 0) : 0
        };

        if (editingId) {
            const index = blogs.findIndex(b => b.id === editingId);
            if (index !== -1) {
                blogs[index] = blogData;
            }
        } else {
            blogs.unshift(blogData);
        }

        this.saveBlogs(blogs);
        this.closeModal();
        this.render();
        if (typeof window.renderBlogTable === 'function') {
            window.renderBlogTable();
        }
        alert('Đã lưu bài viết thành công!');
    },

    // 3. HÀM VẼ BẢNG (ÉP BUỘC LẤY DATA MỚI NHẤT)
    render: function () {
        const tbody = document.getElementById('blogsTable');
        if (!tbody) return;

        let blogs = this.getBlogs();
        const allProducts = JSON.parse(localStorage.getItem('products') || localStorage.getItem('adminProducts') || '[]');
        const rawBlogCount = blogs.length;

        const searchInput = document.getElementById('searchBlog');
        if (searchInput && searchInput.value.trim()) {
            const query = searchInput.value.toLowerCase().trim();
            blogs = blogs.filter(blog => blog.title.toLowerCase().includes(query));
        }

        const totalCount = blogs.length;
        const blogStart = document.getElementById('blogStart');
        const blogEnd = document.getElementById('blogEnd');
        const blogTotal = document.getElementById('blogTotal');
        if (blogStart) blogStart.textContent = totalCount > 0 ? '1' : '0';
        if (blogEnd) blogEnd.textContent = totalCount.toString();
        if (blogTotal) blogTotal.textContent = rawBlogCount.toString();

        if (blogs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#6b7280;">Không tìm thấy bài viết phù hợp.</td></tr>';
            return;
        }

        tbody.innerHTML = blogs.map(blog => {
            const product = (Array.isArray(allProducts) ? allProducts : []).find(p => p.id === blog.productId);
            const productLabel = product ? product.name : (blog.relatedProducts || blog.product || 'Không gắn');
            const imageUrl = blog.image || this.defaultImage;
            return `
                <tr>
                    <td>${blog.id}</td>
                    <td><img src="${imageUrl}" alt="${blog.title}" style="width: 100px; height: 72px; object-fit: cover; border-radius: 8px;" onerror="this.src='${this.defaultImage}';"></td>
                    <td style="max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${blog.title}"><strong>${blog.title}</strong></td>
                    <td>${blog.date}</td>
                    <td><span class="status-badge success">${productLabel}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="BLOG_SYSTEM.openModal('${blog.id}')" title="Sửa"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete" onclick="BLOG_SYSTEM.delete('${blog.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    },

    // 4. HÀM XÓA - FIXED: Clear search + debug logs + double render + toast
    delete: function (id) {
        console.log('🗑️ Deleting blog ID:', id);
        if (confirm("Bạn có chắc muốn xóa vĩnh viễn bài này?")) {
            let blogs = JSON.parse(localStorage.getItem(this.key)) || [];
            console.log('📊 Before delete:', blogs.length, 'blogs');
            console.log('🔍 Searching for ID:', id, 'Found:', blogs.filter(b => b.id === id));

            const beforeLength = blogs.length;
            blogs = blogs.filter(b => b.id !== id);
            console.log('📊 After filter:', blogs.length, 'blogs (removed:', beforeLength - blogs.length, ')');

            localStorage.setItem(this.key, JSON.stringify(blogs));
            console.log('💾 localStorage updated. Final count:', blogs.length);

            // 🔥 FIX #1: Clear search input to reset filter state
            const searchInput = document.getElementById('searchBlog');
            if (searchInput) {
                const oldValue = searchInput.value;
                searchInput.value = '';
                console.log('🔄 Cleared search input:', oldValue, '→ ""');
            }

            // 🔥 FIX #2: Double render for safety
            this.render();
            if (typeof window.renderBlogTable === 'function') {
                window.renderBlogTable();
            }

            // 🔥 FIX #3: Trigger success toast (matches user expectation)
            if (typeof showToast === 'function') {
                showToast('Đã xóa bài viết thành công!', 'success');
            } else {
                alert('Đã xóa bài viết thành công!');
            }

            console.log('✅ Delete complete. Table should refresh without search filter.');
        }
    }
};

// GÁN RA WINDOW ĐỂ HTML GỌI ĐƯỢC - Task exact names
window.addBlog = () => BLOG_SYSTEM.save();          // For add new (empty form)
window.editBlog = (id) => BLOG_SYSTEM.openModal(id); // Populate form for edit
window.updateBlog = () => BLOG_SYSTEM.save();        // Save changes (edit or add)
window.deleteBlog = (id) => BLOG_SYSTEM.delete(id);  // Delete by ID
window.renderBlogTable = () => BLOG_SYSTEM.render(); // Render table
// Legacy aliases
window.openBlogModal = window.editBlog;
window.saveBlog = window.updateBlog;
window.renderBlogList = window.renderBlogTable;

// TỰ ĐỘNG CHẠY KHI TAB BLOG HIỆN LÊN (Sửa lại hàm showSection của bạn)
const originalShowSection = window.showSection;
window.showSection = function (id) {
    if (originalShowSection) originalShowSection(id);
    if (id === 'blog-management') BLOG_SYSTEM.render();
};


