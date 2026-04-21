// Đồng bộ số lượng giỏ hàng
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
});

// Hàm lọc sản phẩm theo thương hiệu
function filterByBrand(brandSlug) {
    // Chuyển hướng đến trang sản phẩm với tham số brand
    window.location.href = 'products.html?brand=' + encodeURIComponent(brandSlug);
}

