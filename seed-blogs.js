// Seed admin_blogs from blog-data.js
// Run: node seed-blogs.js OR paste in console

(async () => {
    if (typeof blogData === 'undefined') {
        console.error('blogData not found - load js/blog-data.js first');
        return;
    }

    const PRODUCTS_KEY = 'adminProducts';
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');

    const normalizedBlogs = blogData.map(blog => ({
        id: blog.id.toString(),
        title: blog.title,
        image: blog.image,
        productId: blog.productId,
        relatedProducts: blog.productId ? products.find(p => p.id === blog.productId)?.name || blog.relatedProducts || '' : '',
        date: blog.date,
        content: blog.content,
        excerpt: blog.excerpt,
        views: blog.views ? parseInt(blog.views.replace(/[k.]/g, '') * (blog.views.includes('k') ? 1000 : 1)) : 0,
        author: blog.author || 'Thanh Tâm Team'
    }));

    localStorage.setItem('admin_blogs', JSON.stringify(normalizedBlogs));
    console.log(`✅ Seeded ${normalizedBlogs.length} blogs to admin_blogs`);
    console.log('Test: window.renderBlogAdminTable() // admin');
    console.log('Test: window.renderUserBlogList() // user fallback');
})();

