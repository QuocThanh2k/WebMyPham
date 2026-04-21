/**
 * HỆ THỐNG BLOG THANH TÂM COSMETICS - LOGIC CHUNG (FIXED Step 3/5)
 * ✅ UNIFIED: Use 'admin_blogs' key (matches admin-page.js)
 * ✅ RENAMED: Functions to avoid conflicts with admin-page.js
 * ✅ DISABLED: Migration to prevent data loss
 * Compatible: admin.html, blog.html, blog-detail.html
 */

const BLOGS_KEY = 'admin_blogs';  // ✅ FIXED: Unified with admin-page.js
const PRODUCTS_KEY = 'adminProducts';

/** Normalize blog object cho unified schema */
function normalizeBlog(blog) {
    return {
        id: blog.id || Date.now().toString(),
        title: blog.title || '',
        image: blog.thumbnail || blog.image || '',
        relatedProducts: blog.productId ?
            JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]').find(p => p.id == blog.productId)?.name ||
            blog.relatedProducts || '' : '',
        date: formatDateVN(blog.date || new Date()),
        content: blog.content || '',
        excerpt: (blog.content || '').slice(0, 150) + '...',
        views: blog.views || 0,
        author: blog.author || 'Thanh Tâm Team'
    };
}

/** CORE DATA OPERATIONS ====================================================== */
function getBlogs() {
    // ✅ FIXED: Always use unified key
    return JSON.parse(localStorage.getItem(BLOGS_KEY) || '[]');
}

function saveBlogs(blogs) {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
}

function findBlogById(id) {
    return getBlogs().find(b => b.id === id);
}

function deleteBlog(id) {
    const blogs = getBlogs().filter(b => b.id !== id);
    saveBlogs(blogs);
    return blogs;
}

function updateBlogViews(id) {
    const blogs = getBlogs();
    const index = blogs.findIndex(b => b.id === id);
    if (index > -1) {
        blogs[index].views = (blogs[index].views || 0) + 1;
        saveBlogs(blogs);
    }
}

/** SAVE/UPDATE từ Admin Form ================================================= */
function saveAdminBlogForm(formId = 'blogForm') {
    const form = document.getElementById(formId);
    if (!form) return false;

    const formData = new FormData(form);
    const blogId = formData.get('blogId') || '';
    const title = formData.get('blogTitle') || '';
    const image = formData.get('blogImage') || '';
    const productId = formData.get('blogProduct') || '';
    const dateInput = formData.get('blogDate') || new Date().toISOString().split('T')[0];

    // Get CKEditor content
    let content = '';
    if (typeof window.blogEditor !== 'undefined' && window.blogEditor) {
        content = window.blogEditor.getData();
    } else {
        content = formData.get('blogContent') || '';
    }

    if (!title.trim() || !content.trim()) {
        alert('Vui lòng nhập tiêu đề và nội dung!');
        return false;
    }

    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const relatedProducts = productId ? products.find(p => p.id == productId)?.name || '' : '';

    const blogData = {
        id: blogId || Date.now().toString(),
        title: title.trim(),
        image,
        productId,
        relatedProducts,
        date: formatDateVN(dateInput),
        content: content.trim(),
        views: 0,
        author: 'Thanh Tâm Team'
    };

    let blogs = getBlogs();
    if (blogId) {
        const index = blogs.findIndex(b => b.id === blogId);
        if (index > -1) blogs[index] = blogData;
        else blogs.unshift(blogData);
    } else {
        blogs.unshift(blogData);
    }

    saveBlogs(blogs);
    console.log('✅ saveBlogFromForm saved to admin_blogs');
    return blogData;
}

/** LOAD form cho Edit từ Admin ============================================== */
function loadAdminBlogForm(blogId, formId = 'blogForm') {
    const blog = findBlogById(blogId);
    if (!blog) return;

    const form = document.getElementById(formId);
    if (!form) return;

    document.getElementById('blogId').value = blog.id;
    document.getElementById('blogTitle').value = blog.title;
    document.getElementById('blogImage').value = blog.image;
    document.getElementById('blogDate').value = blog.date.split('/').reverse().join('-');

    const select = document.getElementById('blogProduct');
    if (select) {
        const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        const product = products.find(p => p.name === blog.relatedProducts || p.id === blog.productId);
        select.value = product?.id || '';
    }

    // Load CKEditor
    if (typeof window.blogEditor !== 'undefined' && window.blogEditor) {
        window.blogEditor.setData(blog.content);
    }
}

/** ADMIN TABLE RENDER (RENAMED - No conflict) ================================ */
window.renderBlogAdminTable = function (containerId = 'blogsTable') {  // ✅ RENAMED
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    const blogs = getBlogs();
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');

    if (blogs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;padding:40px;color:#9ca3af;">
                    <i class="fas fa-blog" style="font-size:32px;margin-bottom:12px;"></i>
                    <p>Chưa có bài viết nào. <button class="btn btn-primary btn-sm" onclick="window.openBlogModal()">Viết bài đầu tiên</button></p>
                </td>
            </tr>`;
        return;
    }

    let html = '';
    blogs.slice(0, 10).forEach(blog => {
        const productName = blog.relatedProducts || 'Không gắn';
        html += `
            <tr>
                <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${blog.title}">
                    <strong>${blog.title}</strong>
                </td>
                <td>${blog.date}</td>
                <td>${productName !== 'Không gắn' ?
                `<span class="status-badge success" title="${productName}">${productName}</span>` :
                '<span class="status-badge secondary">Không gắn</span>'}
                </td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="viewBlog('${blog.id}')" title="Xem"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="window.openBlogModal('${blog.id}')" title="Sửa"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="window.deleteBlogLogic('${blog.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    });
    tbody.innerHTML = html;
};

/** USER LIST RENDER (blog.html) ============================================= */
function renderBlogList(mainId = 'blog-main-container', sidebarId = 'blog-sidebar-container') {
    const main = document.getElementById(mainId);
    const sidebar = document.getElementById(sidebarId);
    if (!main || !sidebar) return;

    const blogs = getBlogs();
    if (blogs.length === 0) {
        const emptyHTML = '<div style="padding:60px 20px;text-align:center;color:#9ca3af;"><i class="fas fa-blog fa-3x mb-3" style="opacity:0.5;"></i><p style="font-size:16px;margin:0;">Chưa có bài viết nào</p></div>';
        main.innerHTML = sidebar.innerHTML = emptyHTML;
        return;
    }

    main.innerHTML = ''; sidebar.innerHTML = '';
    blogs.forEach((blog, i) => {
        const link = `blog-detail.html?id=${blog.id}`;
        if (i < 4) { // Large cards
            main.innerHTML += `
                <a href="${link}" class="blog-card-large" style="display:flex;gap:25px;text-decoration:none;color:inherit;align-items:center;">
                    <div class="blog-image-box" style="width:45%;height:260px;border-radius:12px;overflow:hidden;flex-shrink:0;background:#eee;">
                        <img src="${blog.image}" alt="${blog.title}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="width:55%;">
                        <span style="background:rgba(225,29,72,0.1);color:#e11d48;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;">Review</span>
                        <h2 style="font-size:20px;margin:0 0 10px 0;line-height:1.4;color:#111827;">${blog.title}</h2>
                        <div style="font-size:13px;color:#9ca3af;margin-bottom:10px;display:flex;gap:15px;align-items:center;">
                            <span><i class="far fa-user"></i> ${blog.author}</span>
                            <span><i class="far fa-calendar-alt"></i> ${blog.date}</span>
                        </div>
                        <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0 0 15px 0;">${blog.excerpt}</p>
                        <div style="font-size:13px;color:#e11d48;font-weight:600;background:#fff1f2;padding:10px 15px;border-radius:8px;display:inline-flex;gap:20px;">
                            <span><i class="far fa-eye"></i> ${blog.views} lượt xem</span>
                            ${blog.relatedProducts ? `<span><i class="fas fa-tag"></i> ${blog.relatedProducts}</span>` : ''}
                        </div>
                    </div>
                </a>`;
        } else { // Sidebar cards
            sidebar.innerHTML += `
                <a href="${link}" class="blog-card-small" style="display:flex;gap:15px;text-decoration:none;color:inherit;align-items:flex-start;border-bottom:1px dashed #e5e7eb;padding-bottom:15px;">
                    <div class="blog-image-box" style="width:95px;height:95px;border-radius:8px;overflow:hidden;flex-shrink:0;background:#eee;">
                        <img src="${blog.image}" alt="${blog.title}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:13px;margin:0 0 6px 0;line-height:1.4;color:#374151;">${blog.title}</h3>
                        <p style="font-size:11px;color:#9ca3af;margin:0 0 8px 0;">${blog.author} / ${blog.date}</p>
                        <div style="display:flex;gap:12px;font-size:11px;color:#e11d48;font-weight:500;">
                            <span><i class="far fa-eye"></i> ${blog.views}</span>
                        </div>
                    </div>
                </a>`;
        }
    });
}

/** SEARCH HANDLER =========================================================== */
function handleBlogSearch(query, mainId = 'blog-main-container', sidebarId = 'blog-sidebar-container') {
    const main = document.getElementById(mainId);
    const sidebar = document.getElementById(sidebarId);
    if (!main || !sidebar) return;

    const blogs = getBlogs();
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
        renderUserBlogList(mainId, sidebarId);
        return;
    }

    const results = blogs.filter(blog =>
        blog.title.toLowerCase().includes(lowerQuery) ||
        blog.relatedProducts?.toLowerCase().includes(lowerQuery)
    );

    renderUserBlogListCustom(results, mainId, sidebarId); // TODO: define if needed
}

/** DETAIL PAGE RENDER ======================================================= */
function renderBlogDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    const blog = findBlogById(id);
    if (!blog) {
        document.body.innerHTML = '<div style="text-align:center;padding:100px;"><h2>Bài viết không tồn tại</h2><a href="blog.html">← Quay lại Blog</a></div>';
        return;
    }

    updateBlogViews(id);

    document.getElementById('heroTitle').textContent = blog.title;
    document.getElementById('heroMeta').innerHTML = `📝 ${blog.author} | 📅 ${blog.date}`;
    document.title = `${blog.title} - Thanh Tâm Cosmetics`;

    document.getElementById('blogImageContainer').innerHTML = `<img src="${blog.image}" alt="${blog.title}">`;
    document.getElementById('blogBodyContent').innerHTML = blog.content;

    const tagsContainer = document.getElementById('blogTagsContainer');
    tagsContainer.innerHTML = blog.relatedProducts ? `<span>${blog.relatedProducts}</span>` : '';

    const related = getRelatedBlogs(id, 3);
    const relatedContainer = document.getElementById('relatedBlogsContainer');
    relatedContainer.innerHTML = related.map(b =>
        `<a href="blog-detail.html?id=${b.id}" class="related-card">
            <div class="related-image"><img src="${b.image}" alt="${b.title}"></div>
            <div class="related-info">
                <h4>${b.title}</h4>
                <p class="date">${b.date}</p>
            </div>
        </a>`
    ).join('');
}

/** UTILITIES ================================================================ */
function formatDateVN(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

/** GLOBAL EXPOSE (RENAMED - No conflicts) ==================================== */
// ✅ RENAMED to avoid overriding admin-page.js functions
window.renderBlogAdminTable = renderBlogAdminTable;  // For admin table
window.saveAdminBlogForm = saveAdminBlogForm;
window.loadAdminBlogForm = loadAdminBlogForm;
// DISABLED: window.deleteBlogLogic to prevent conflict with admin-page.js BLOG_SYSTEM.deleteBlog
// Admin logic now centralized in js/admin-page.js

// User page functions (unchanged)
window.renderUserBlogList = renderBlogList;
window.handleUserBlogSearch = handleBlogSearch;
window.renderUserBlogDetail = renderBlogDetail;

// Auto init
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ blog-logic.js loaded - Using admin_blogs key');
});

console.log('✅ blog-logic.js FIXED - Unified to admin_blogs, renamed conflicts');

