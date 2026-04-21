const mysql = require('mysql2');

// Cấu hình y hệt như lúc nãy bạn nhập vào Extension
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'admin',
    password: '172004thanh',
    database: 'ThanhtamCosmetics'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Kết nối thất bại. Lỗi:', err.message);
        return;
    }
    console.log('✅ ĐÃ KẾT NỐI THÀNH CÔNG TỚI DATABASE CLOUD!');

    // Thử lấy ra 1 sản phẩm để kiểm tra
    connection.query('SELECT * FROM Products LIMIT 1', (err, results) => {
        console.log('📦 Dữ liệu test:', results);
        connection.end(); // Đóng kết nối
    });
});
