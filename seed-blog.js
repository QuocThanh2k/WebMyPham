const blogData = {
    id: Date.now().toString(),
    title: 'Bí quyết dùng Serum',
    thumbnail: 'https://via.placeholder.com/300x200?text=Serum',
    productId: 'SP001',
    date: '2026-04-02',
    content: `
        <h2>Bí quyết sử dụng Serum hiệu quả</h2>
        <p><strong>Serum là gì?</strong> Serum là sản phẩm dưỡng da tập trung, chứa hàm lượng cao các hoạt chất để giải quyết các vấn đề da cụ thể.</p>
        <p>Để đạt hiệu quả tối ưu, hãy làm theo các bước sau:</p>
        <ul>
            <li><strong>Bước 1:</strong> Rửa mặt sạch sẽ.</li>
            <li><strong>Bước 2:</strong> Thoa một lượng nhỏ serum lên da.</li>
            <li><strong>Bước 3:</strong> Massage nhẹ nhàng để dưỡng chất thẩm thấu.</li>
            <li><strong>Bước 4:</strong> Chờ 5-10 phút trước khi thoa kem dưỡng.</li>
        </ul>
        <p><strong>Lưu ý:</strong> Sử dụng serum 2 lần/ngày, sáng và tối để da khỏe mạnh.</p>
    `
};

let blogs = JSON.parse(localStorage.getItem('admin_blogs') || '[]');
blogs.push(blogData);
localStorage.setItem('admin_blogs', JSON.stringify(blogs));

console.log('Đã thêm bài viết mẫu vào localStorage.');