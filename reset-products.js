// Reset dữ liệu products về trạng thái chuẩn
localStorage.setItem('products', JSON.stringify(window.productsData || []));
location.reload();