function safeFormatDate(dateStr) {
    if (!dateStr) return '';
    // Kiểm tra format YYYY-MM-DD
    if (dateStr.includes('-') && !dateStr.includes('/')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;  // DD/MM/YYYY
        }
    }
    // Nếu đã là DD/MM/YYYY hoặc format khác, giữ nguyên
    return dateStr;
}

function loadBlogDetail() {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('id');

    // Lấy đúng danh sách admin_blogs
    // Đọc dữ liệu linh hoạt giống trang blog.html
    let allBlogs = [];
    try {
        allBlogs = JSON.parse(localStorage.getItem('admin_blogs'));
        if (!allBlogs || allBlogs.length === 0) {
            allBlogs = JSON.parse(localStorage.getItem('blogs'));
        }
    } catch (e) { }

    if (!allBlogs || allBlogs.length === 0) {
        allBlogs = typeof blogsData !== 'undefined' ? blogsData : [];
    }
    const blog = allBlogs.find(b => b.id == blogId);

    if (!blog) {
        document.querySelector('.blog-detail-container').innerHTML = `
            <div style="text-align:center; padding:100px 0;">
                <h2>Bài viết không tồn tại hoặc đã bị xóa.</h2>
                <a href="blog.html" style="color: #e11d48;">Quay lại trang Blog</a>
            </div>`;
        return;
    }

    // Hiển thị nội dung
    document.title = blog.title;
    document.getElementById('heroTitle').textContent = blog.title;
    document.getElementById('heroMeta').innerHTML = `<i class="far fa-calendar-alt"></i> Ngày đăng: ${safeFormatDate(blog.date)}`;
    const blogImage = blog.thumbnail || blog.image || 'images/logo/logo_backup.png';
    document.getElementById('blogImageContainer').innerHTML = `<img src="${blogImage}" alt="${blog.title}" style="width:100%; border-radius:16px; background: #f3f4f6;" onerror="this.src='images/logo/logo_backup.png';">`;
    document.getElementById('blogBodyContent').innerHTML = blog.content; // Hiển thị nội dung HTML từ CKEditor

    // Tăng lượt xem (tùy chọn)
    blog.views = (blog.views || 0) + 1;
    localStorage.setItem('admin_blogs', JSON.stringify(allBlogs));
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogDetail();

    // Cart sync
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
});

