// Server API Node.js Express - Kết nối Azure SQL Database
// Website bán mỹ phẩm Thanh Tâm

const express = require('express');
const cors = require('cors');
const mssql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Azure SQL Database Configuration
const dbConfig = {
    server: process.env.DB_SERVER || 'your-server.database.windows.net',
    database: process.env.DB_NAME || 'ThanhtamCosmetics',
    user: process.env.DB_USER || 'your-username',
    password: process.env.DB_PASSWORD || 'your-password',
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Connect to Azure SQL
mssql.connect(dbConfig)
    .then(pool => {
        if (pool.connected) {
            console.log('✅ Kết nối Azure SQL Database thành công!');
        }
        return pool;
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database:', err.message);
    });

// ==================== API ENDPOINTS ====================

// 1. Lấy tất cả sản phẩm
app.get('/api/products', async (req, res) => {
    try {
        const { category, brand, skinType, page = 1, limit = 20 } = req.query;

        let query = 'SELECT * FROM Products WHERE 1=1';
        let params = [];

        if (category) {
            query += ' AND CategoryID = @category';
            params.push({ name: 'category', value: parseInt(category) });
        }

        if (brand) {
            query += ' AND BrandID = @brand';
            params.push({ name: 'brand', value: parseInt(brand) });
        }

        if (skinType) {
            query += ' AND SkinType = @skinType';
            params.push({ name: 'skinType', value: skinType });
        }

        query += ' ORDER BY CreatedDate DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
        params.push(
            { name: 'offset', value: (page - 1) * limit },
            { name: 'limit', value: parseInt(limit) }
        );

        const result = await mssql.query(query, params);
        res.json({
            success: true,
            data: result.recordset,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: result.rowsAffected[0]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Lấy chi tiết sản phẩm
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await mssql.query(
            'SELECT * FROM Products WHERE ProductID = @id',
            [{ name: 'id', value: parseInt(id) }]
        );

        if (result.recordset.length > 0) {
            res.json({ success: true, data: result.recordset[0] });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. Lấy danh sách danh mục
app.get('/api/categories', async (req, res) => {
    try {
        const result = await mssql.query('SELECT * FROM Categories ORDER BY CategoryID');
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. Lấy danh sách thương hiệu
app.get('/api/brands', async (req, res) => {
    try {
        const result = await mssql.query('SELECT * FROM Brands ORDER BY BrandID');
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 5. Tìm kiếm sản phẩm
app.get('/api/products/search', async (req, res) => {
    try {
        const { q } = req.query;
        const result = await mssql.query(
            'SELECT * FROM Products WHERE ProductName LIKE @query ORDER BY ProductName',
            [{ name: 'query', value: `%${q}%` }]
        );
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 6. Lấy sản phẩm theo loại da
app.get('/api/products/skin-type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await mssql.query(
            'SELECT * FROM Products WHERE SkinType = @type',
            [{ name: 'type', value: type }]
        );
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 7. Áp dụng mã giảm giá
app.post('/api/coupons/apply', async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        // Kiểm tra mã giảm giá trong database
        const result = await mssql.query(
            'SELECT * FROM Coupons WHERE CouponCode = @code AND IsActive = 1',
            [{ name: 'code', value: code.toUpperCase() }]
        );

        if (result.recordset.length === 0) {
            return res.json({
                success: false,
                message: 'Mã giảm giá không hợp lệ!'
            });
        }

        const coupon = result.recordset[0];

        // Kiểm tra điều kiện tối thiểu
        if (subtotal < coupon.MinAmount) {
            return res.json({
                success: false,
                message: `Đơn hàng tối thiểu ${coupon.MinAmount.toLocaleString('vi-VN')}đ`
            });
        }

        // Tính toán giảm giá
        let discount = 0;
        let shipping = subtotal >= 500000 ? 0 : 30000;

        if (coupon.DiscountPercent > 0) {
            discount = subtotal * (coupon.DiscountPercent / 100);
        }

        // Miễn phí vận chuyển
        if (coupon.IsFreeShipping) {
            shipping = 0;
        }

        const total = subtotal - discount + shipping;

        res.json({
            success: true,
            data: {
                coupon: coupon.CouponCode,
                discount: discount,
                shipping: shipping,
                subtotal: subtotal,
                total: total
            },
            message: 'Áp dụng mã giảm giá thành công!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 8. Tạo đơn hàng
app.post('/api/orders', async (req, res) => {
    try {
        const { customerId, items, subtotal, discount, shipping, total, couponCode } = req.body;

        // Tạo đơn hàng
        const orderResult = await mssql.query(`
            INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, Status, CouponCode)
            OUTPUT INSERTED.OrderID
            VALUES (@customerId, GETDATE(), @total, N'Chờ xác nhận', @couponCode)
        `, [
            { name: 'customerId', value: customerId },
            { name: 'total', value: total },
            { name: 'couponCode', value: couponCode || null }
        ]);

        const orderId = orderResult.recordset[0].OrderID;

        // Thêm chi tiết đơn hàng
        for (const item of items) {
            await mssql.query(`
                INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
                VALUES (@orderId, @productId, @quantity, @price)
            `, [
                { name: 'orderId', value: orderId },
                { name: 'productId', value: parseInt(item.id) },
                { name: 'quantity', value: item.quantity },
                { name: 'price', value: item.price }
            ]);
        }

        res.json({
            success: true,
            message: 'Đặt hàng thành công!',
            orderId: orderId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 9. Đăng nhập
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await mssql.query(
            'SELECT * FROM Customers WHERE Email = @email AND Password = @password',
            [
                { name: 'email', value: email },
                { name: 'password', value: password }
            ]
        );

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({
                success: true,
                message: 'Đăng nhập thành công!',
                user: {
                    id: user.CustomerID,
                    name: user.FullName,
                    email: user.Email,
                    phone: user.Phone,
                    role: user.Role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 10. Đăng ký
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Kiểm tra email đã tồn tại
        const checkResult = await mssql.query(
            'SELECT * FROM Customers WHERE Email = @email',
            [{ name: 'email', value: email }]
        );

        if (checkResult.recordset.length > 0) {
            return res.json({ success: false, message: 'Email đã được sử dụng!' });
        }

        // Thêm người dùng mới
        await mssql.query(`
            INSERT INTO Customers (FullName, Email, Phone, Password, Role, CreatedDate)
            VALUES (@name, @email, @phone, @password, N'customer', GETDATE())
        `, [
            { name: 'name', value: name },
            { name: 'email', value: email },
            { name: 'phone', value: phone },
            { name: 'password', value: password }
        ]);

        res.json({
            success: true,
            message: 'Đăng ký thành công!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
});

module.exports = app;
