-- ==========================================================
-- DATABASE FULL SCRIPT: ThanhtamCosmetics
-- Hợp nhất: Schema + Đầy đủ 300 Sản phẩm (10 Thương hiệu x 30 SP)
-- ==========================================================

SET NOCOUNT ON;

-- 1. KHỞI TẠO DATABASE
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ThanhtamCosmetics')
BEGIN
    CREATE DATABASE ThanhtamCosmetics;
END
GO

USE ThanhtamCosmetics;
GO

-- 2. XÓA BẢNG CŨ (Theo thứ tự ưu tiên bảng con trước bảng cha)
DROP TABLE IF EXISTS GiaoDichThuChi;
DROP TABLE IF EXISTS ChiTietDonHang;
DROP TABLE IF EXISTS DonHang;
DROP TABLE IF EXISTS MaGiamGia;
DROP TABLE IF EXISTS KhachHang;
DROP TABLE IF EXISTS SanPham;
DROP TABLE IF EXISTS ThuongHieu;
DROP TABLE IF EXISTS DanhMuc;
GO

-- 3. TẠO CẤU TRÚC BẢNG

CREATE TABLE DanhMuc (
    MaDanhMuc INT PRIMARY KEY IDENTITY(1,1),
    TenDanhMuc NVARCHAR(100) NOT NULL,
    SlugDanhMuc VARCHAR(50) NOT NULL,
    IconDanhMuc VARCHAR(50),
    MoTa NVARCHAR(500),
    DangHoatDong BIT DEFAULT 1,
    NgayTao DATETIME DEFAULT GETDATE()
);

CREATE TABLE ThuongHieu (
    MaThuongHieu INT PRIMARY KEY IDENTITY(1,1),
    TenThuongHieu NVARCHAR(100) NOT NULL,
    SlugThuongHieu VARCHAR(50) NOT NULL,
    LogoThuongHieu VARCHAR(255),
    MoTa NVARCHAR(500),
    DangHoatDong BIT DEFAULT 1,
    NgayTao DATETIME DEFAULT GETDATE()
);

CREATE TABLE SanPham (
    MaSanPham INT PRIMARY KEY IDENTITY(1,1),
    TenSanPham NVARCHAR(255) NOT NULL,
    SlugSanPham VARCHAR(255),
    MoTa NVARCHAR(MAX),
    Gia DECIMAL(18,2) NOT NULL,
    GiaGoc DECIMAL(18,2),
    MaDanhMuc INT FOREIGN KEY REFERENCES DanhMuc(MaDanhMuc),
    MaThuongHieu INT FOREIGN KEY REFERENCES ThuongHieu(MaThuongHieu),
    LoaiDa NVARCHAR(50),
    LinkAnh VARCHAR(500),
    SoLuongKho INT DEFAULT 0,
    SoLuongDaBan INT DEFAULT 0,
    DanhGia DECIMAL(3,2) DEFAULT 5.00,
    NgayNhapHang DATE,
    HanSuDung DATE,
    DangHoatDong BIT DEFAULT 1,
    NgayTao DATETIME DEFAULT GETDATE()
);

CREATE TABLE KhachHang (
    MaKhachHang INT PRIMARY KEY IDENTITY(1,1),
    HoTen NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(20),
    DiaChi NVARCHAR(500),
    VaiTro NVARCHAR(20) DEFAULT N'customer',
    DangHoatDong BIT DEFAULT 1,
    NgayTao DATETIME DEFAULT GETDATE()
);

CREATE TABLE MaGiamGia (
    MaGiamGiaID INT PRIMARY KEY IDENTITY(1,1),
    MaCode VARCHAR(50) NOT NULL UNIQUE, -- Cột này phải UNIQUE để làm khóa ngoại
    MoTa NVARCHAR(255),
    PhanTramGiam DECIMAL(5,2) DEFAULT 0,
    SoTienGiam DECIMAL(18,2) DEFAULT 0,
    DonHangToiThieu DECIMAL(18,2) DEFAULT 0,
    MienPhiVanChuyen BIT DEFAULT 0,
    DangHoatDong BIT DEFAULT 1,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    NgayTao DATETIME DEFAULT GETDATE()
);

CREATE TABLE DonHang (
    MaDonHang INT PRIMARY KEY IDENTITY(1,1),
    MaKhachHang INT FOREIGN KEY REFERENCES KhachHang(MaKhachHang),
    NgayDat DATETIME DEFAULT GETDATE(),
    TrangThai NVARCHAR(50) DEFAULT N'Chờ xác nhận',
    -- KẾT NỐI: Liên kết cột mã giảm giá vào bảng MaGiamGia
    MaGiamGiaCode VARCHAR(50) FOREIGN KEY REFERENCES MaGiamGia(MaCode), 
    TongTienHang DECIMAL(18,2),
    SoTienGiam DECIMAL(18,2) DEFAULT 0,
    PhiVanChuyen DECIMAL(18,2) DEFAULT 0,
    TongThanhToan DECIMAL(18,2),
    DiaChiGiaoHang NVARCHAR(500),
    PhuongThucThanhToan NVARCHAR(50),
    GhiChu NVARCHAR(500)
);

CREATE TABLE ChiTietDonHang (
    MaChiTiet INT PRIMARY KEY IDENTITY(1,1),
    MaDonHang INT FOREIGN KEY REFERENCES DonHang(MaDonHang),
    MaSanPham INT FOREIGN KEY REFERENCES SanPham(MaSanPham),
    SoLuong INT NOT NULL,
    GiaDonVi DECIMAL(18,2) NOT NULL,
    GiamGia DECIMAL(18,2) DEFAULT 0
);

CREATE TABLE GiaoDichThuChi (
    MaGiaoDich INT IDENTITY(1,1) PRIMARY KEY,
    Loai NVARCHAR(10) NOT NULL, -- 'thu' hoặc 'chi'
    DanhMuc NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(500) NOT NULL,
    SoTien DECIMAL(18, 2) NOT NULL,
    NgayGiaoDich DATE NOT NULL,
    PhuongThuc NVARCHAR(50),
    -- KẾT NỐI: Liên kết giao dịch với đơn hàng cụ thể
    MaDonHang INT FOREIGN KEY REFERENCES DonHang(MaDonHang), 
    GhiChu NVARCHAR(500),
    NgayTao DATETIME DEFAULT GETDATE()
);
GO

-- 4. CHÈN DANH MỤC
INSERT INTO DanhMuc
    (TenDanhMuc, SlugDanhMuc, IconDanhMuc)
VALUES
    (N'Chăm sóc da', 'skincare', 'fa-spa'),
    -- ID 1
    (N'Trang điểm', 'makeup', 'fa-paint-brush'),
    -- ID 2
    (N'Làm sạch', 'cleansing', 'fa-hands-wash'),
    -- ID 3
    (N'Nước hoa', 'perfume', 'fa-wind'),
    -- ID 4
    (N'Chăm sóc tóc', 'haircare', 'fa-hair'); -- ID 5
GO

-- 5. CHÈN THƯƠNG HIỆU
INSERT INTO ThuongHieu
    (TenThuongHieu, SlugThuongHieu)
VALUES
    ('Laneige', 'laneige'),
    -- ID 1
    ('Innisfree', 'innisfree'),
    -- ID 2
    ('MAC', 'mac'),
    -- ID 3
    ('Dior', 'dior'),
    -- ID 4
    ('The Ordinary', 'theordinary'),
    -- ID 5
    ('La Roche-Posay', 'larocheposay'),
    -- ID 6
    ('Cocoon', 'cocoon'),
    -- ID 7
    ('Garnier', 'garnier'),
    -- ID 8
    ('Yves Saint Laurent', 'ysl'),
    -- ID 9
    ('Chanel', 'chanel'); -- ID 10
GO

-- 6. THÊM CỘT NGÀY NHẬP & HSD ✅ TASK FILTER EXPIRING
ALTER TABLE SanPham ADD NgayNhapHang DATE, HanSuDung DATE;
ALTER TABLE SanPham NOCHECK CONSTRAINT ALL;

UPDATE SanPham 
SET 
    -- Tính Ngày Nhập Hàng: Ngày hiện tại trừ đi 0-364 ngày
    NgayNhapHang = DATEADD(DAY, -(ABS(CHECKSUM(NEWID())) % 365), GETDATE()),
    -- Tính Hạn Sử Dụng: Lấy Ngày Nhập Hàng vừa tính + (90 đến 819 ngày)
    HanSuDung = DATEADD(DAY, (ABS(CHECKSUM(NEWID())) % 730) + 90, 
                DATEADD(DAY, -(ABS(CHECKSUM(NEWID())) % 365), GETDATE()))
WHERE HanSuDung IS NULL;

-- Bulk update còn lại với ngày ngẫu nhiên
UPDATE SanPham 
SET 
    -- 1. Tính NgayNhapHang ngẫu nhiên trong vòng 365 ngày qua
    NgayNhapHang = DATEADD(DAY, - (ABS(CHECKSUM(NEWID())) % 365), GETDATE()),

    -- 2. Tính HanSuDung = NgayNhapHang (vừa tính) + ngẫu nhiên (90 đến 820 ngày)
    -- Lưu ý: Trong MSSQL, ta phải dùng biểu thức tính NgayNhapHang trực tiếp ở đây
    HanSuDung = DATEADD(DAY, 
                        (ABS(CHECKSUM(NEWID())) % 730) + 90, 
                        DATEADD(DAY, - (ABS(CHECKSUM(NEWID())) % 365), GETDATE()))
WHERE HanSuDung IS NULL;

-- LANEIGE (MaThuongHieu=1)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Kem Dưỡng Ẩm Water Bank', 'laneige-water-bank', N'Kem dưỡng ẩm cấp nước cho da', 385000, 450000, 1, 1, 'da-dau', 'images/SP/L001.jpg', 50, 4.7),
    (N'Sleeping Mask 2X', 'laneige-sleeping-mask-2x', N'Mặt nạ ngủ cấp ẩm gấp đôi', 420000, NULL, 1, 1, 'da-kho', 'images/SP/L002.jpg', 45, 4.9),
    (N'Lip Sleeping Mask', 'laneige-lip-mask', N'Mặt nạ ngủ dưỡng môi', 265000, 320000, 1, 1, 'all', 'images/SP/L003.jpg', 80, 4.8),
    (N'Toner Pore Tightening', 'laneige-toner-pore', N'Nước hoa hồng se khít lỗ chân lông', 195000, NULL, 1, 1, 'da-dau', 'images/SP/L004.jpg', 70, 4.5),
    (N'Essence Emulsion', 'laneige-essence-emulsion', N'Tinh chất dưỡng ẩm emulsion', 355000, NULL, 1, 1, 'da-hon-hop', 'images/SP/L005.jpg', 55, 4.6),
    (N'Cream Skin Refiner', 'laneige-cream-skin', N'Nước dưỡng da dạng cream', 425000, 500000, 1, 1, 'da-kho', 'images/SP/L006.jpg', 40, 4.8),
    (N'Eye Cream', 'laneige-eye-cream', N'Kem dưỡng mắt giảm quầng thâm', 485000, NULL, 1, 1, 'all', 'images/SP/L007.jpg', 35, 4.6),
    (N'Cleansing Foam', 'laneige-cleansing-foam', N'Sữa rửa mặt tạo bọt mịn', 165000, NULL, 3, 1, 'da-dau', 'images/SP/L008.jpg', 90, 4.5),
    (N'Oil Cleansing', 'laneige-oil-cleansing', N'Dầu tẩy trang làm sạch sâu', 225000, 280000, 3, 1, 'all', 'images/SP/L009.jpg', 65, 4.7),
    (N'Water Drop Cream', 'laneige-water-drop', N'Kem dưỡng thấm nhanh như nước', 395000, NULL, 1, 1, 'da-dau', 'images/SP/L010.jpg', 50, 4.8),
    (N'Mineral Eye Palette', 'laneige-eye-palette', N'Bảng phấn mắt khoáng', 485000, NULL, 2, 1, 'all', 'images/SP/L011.jpg', 40, 4.6),
    (N'Lip Glow', 'laneige-lip-glow', N'Son dưỡng môi có màu', 285000, NULL, 2, 1, 'all', 'images/SP/L012.jpg', 75, 4.7),
    (N'Cushion SPF50', 'laneige-cushion-spf50', N'Cushion chống nắng SPF50', 455000, 520000, 2, 1, 'all', 'images/SP/L013.jpg', 45, 4.8),
    (N'Serum Vitamin C', 'laneige-serum-vitc', N'Serum Vitamin C làm sáng da', 585000, NULL, 1, 1, 'da-kho', 'images/SP/L014.jpg', 35, 4.9),
    (N'Firming Cream', 'laneige-firming-cream', N'Kem dưỡng làm săn chắc da', 625000, 750000, 1, 1, 'da-kho', 'images/SP/L015.jpg', 30, 4.6),
    (N'Aloe Soothing Gel', 'laneige-aloe-gel', N'Gel aloe vera làm dịu da', 185000, NULL, 1, 1, 'da-nhay-cam', 'images/SP/L016.jpg', 85, 4.7),
    (N'Whitening Essence', 'laneige-whitening', N'Tinh chất trắng da', 525000, NULL, 1, 1, 'da-hon-hop', 'images/SP/L017.jpg', 40, 4.5),
    (N'Pore Care Serum', 'laneige-pore-serum', N'Serum thu nhỏ lỗ chân lông', 445000, 520000, 1, 1, 'da-dau', 'images/SP/L018.jpg', 45, 4.6),
    (N'Hydro UV Essence', 'laneige-uv-essence', N'Kem chống nắng dạng essence', 365000, NULL, 1, 1, 'all', 'images/SP/L019.jpg', 60, 4.7),
    (N'Deep Care Mask', 'laneige-deep-mask', N'Mặt nạ dưỡng sâu', 245000, NULL, 1, 1, 'da-kho', 'images/SP/L020.jpg', 70, 4.5),
    (N'Collagen Cream', 'laneige-collagen', N'Kem collagen dưỡng da', 685000, 820000, 1, 1, 'da-kho', 'images/SP/L021.jpg', 25, 4.7),
    (N'Airy Mint Toner', 'laneige-mint-toner', N'Nước hoa hồng bạc hà mát lạnh', 205000, NULL, 1, 1, 'da-dau', 'images/SP/L022.jpg', 75, 4.6),
    (N'Night Recovery Cream', 'laneige-night-cream', N'Kem phục hồi ban đêm', 545000, NULL, 1, 1, 'da-kho', 'images/SP/L023.jpg', 35, 4.8),
    (N'Cica Sleeping Mask', 'laneige-cica-mask', N'Mặt nạ ngủ Cica làm dịu', 385000, 450000, 1, 1, 'da-nhay-cam', 'images/SP/L024.jpg', 50, 4.9),
    (N'Moisture Foundation', 'laneige-foundation', N'Phấn nền dưỡng ẩm', 465000, NULL, 2, 1, 'da-kho', 'images/SP/L025.jpg', 40, 4.6),
    (N'Lip Stain', 'laneige-lip-stain', N'Son lâu trôi', 325000, NULL, 2, 1, 'all', 'images/SP/L026.jpg', 60, 4.7),
    (N'Perfect Compact', 'laneige-compact', N'Phấn phủ mịn lì', 385000, 450000, 2, 1, 'da-dau', 'images/SP/L027.jpg', 45, 4.5),
    (N'Hair Mist', 'laneige-hair-mist', N'Xịt tóc dưỡng ẩm', 285000, NULL, 5, 1, 'all', 'images/SP/L028.jpg', 55, 4.4),
    (N'Body Lotion', 'laneige-body-lotion', N'Sữa dưỡng thể', 325000, NULL, 1, 1, 'da-kho', 'images/SP/L029.jpg', 50, 4.6),
    (N'Hand Cream', 'laneige-hand-cream', N'Kem dưỡng tay', 155000, 180000, 1, 1, 'da-kho', 'images/SP/L030.jpg', 80, 4.7);

-- INNISFREE (MaThuongHieu=2)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Green Tea Seed Hyaluronic', 'innisfree-green-tea-hyaluronic', N'Tinh chất trà xanh hyaluronic', 385000, 450000, 1, 2, 'da-dau', 'images/SP/I001.jpg', 55, 4.8),
    (N'Jeju Lava Seawater', 'innisfree-seawater', N'Nước biển núi lửa Jeju', 275000, NULL, 1, 2, 'da-hon-hop', 'images/SP/I002.jpg', 65, 4.6),
    (N'Volcanic Pore Cleansing', 'innisfree-volcanic-cleansing', N'Sữa rửa mặt núi lửa', 185000, NULL, 3, 2, 'da-dau', 'images/SP/I003.jpg', 90, 4.7),
    (N'Volcanic Pore Clay Mask', 'innisfree-volcanic-mask', N'Mặt nạ đất sét núi lửa', 225000, 280000, 3, 2, 'da-dau', 'images/SP/I004.jpg', 70, 4.8),
    (N'Orchid Skin', 'innisfree-orchid-skin', N'Tinh dầu hoa lan dưỡng da', 485000, NULL, 1, 2, 'da-kho', 'images/SP/I005.jpg', 40, 4.9),
    (N'Green Tea Toner', 'innisfree-green-tea-toner', N'Nước hoa hồng trà xanh', 195000, NULL, 1, 2, 'da-dau', 'images/SP/I006.jpg', 85, 4.7),
    (N'Apple Seed Eye Cream', 'innisfree-apple-eye', N'Kem dưỡng mắt hạt táo', 425000, 500000, 1, 2, 'all', 'images/SP/I007.jpg', 45, 4.6),
    (N'Soybean Energy Cream', 'innisfree-soybean-cream', N'Kem năng lượng đậu nành', 365000, NULL, 1, 2, 'da-kho', 'images/SP/I008.jpg', 55, 4.5),
    (N'Honey Propolis Cream', 'innisfree-honey-cream', N'Kem mật ong propolis', 445000, NULL, 1, 2, 'da-kho', 'images/SP/I009.jpg', 40, 4.8),
    (N'Bija Trouble Cream', 'innisfree-bija-cream', N'Kem trị mụn Bija', 285000, 350000, 1, 2, 'da-dau', 'images/SP/I010.jpg', 60, 4.7),
    (N'Aloe Revital Cream', 'innisfree-aloe-cream', N'Kem aloe vera phục hồi', 295000, NULL, 1, 2, 'da-nhay-cam', 'images/SP/I011.jpg', 65, 4.6),
    (N'Rose Hydrating Line', 'innisfree-rose-line', N'Dưỡng ẩm hoa hồng', 355000, NULL, 1, 2, 'da-kho', 'images/SP/I012.jpg', 50, 4.7),
    (N'Blueberry Rebalancing', 'innisfree-blueberry', N'Cân bằng da với việt quất', 385000, 450000, 1, 2, 'da-hon-hop', 'images/SP/I013.jpg', 45, 4.5),
    (N'Sea Grape Mask', 'innisfree-sea-grape', N'Mặt nạ rong biển', 185000, NULL, 3, 2, 'all', 'images/SP/I014.jpg', 75, 4.6),
    (N'Deep Cleansing Oil', 'innisfree-cleansing-oil', N'Dầu tẩy trang sâu', 215000, NULL, 3, 2, 'all', 'images/SP/I015.jpg', 70, 4.7),
    (N'Green Tea Eye Serum', 'innisfree-tea-eye', N'Tinh chất trà xanh dưỡng mắt', 365000, 420000, 1, 2, 'all', 'images/SP/I016.jpg', 40, 4.6),
    (N'Vitamin Tree Cream', 'innisfree-vitamin-tree', N'Kem vitamin từ cây', 425000, NULL, 1, 2, 'da-kho', 'images/SP/I017.jpg', 35, 4.8),
    (N'Olive Lotion', 'innisfree-olive-lotion', N'Sữa dưỡng ô liu', 285000, NULL, 1, 2, 'da-kho', 'images/SP/I018.jpg', 55, 4.5),
    (N'Cucumber Fresh Cream', 'innisfree-cucumber-cream', N'Kem dưa leo mát lành', 265000, 320000, 1, 2, 'da-nhay-cam', 'images/SP/I019.jpg', 60, 4.6),
    (N'Pomegranate Cream', 'innisfree-pomegranate', N'Kem lựu chống lão hóa', 485000, NULL, 1, 2, 'da-kho', 'images/SP/I020.jpg', 35, 4.7),
    (N'Tea Tree Serum', 'innisfree-tea-tree-serum', N'Serum tràm trà trị mụn', 345000, NULL, 1, 2, 'da-dau', 'images/SP/I021.jpg', 50, 4.8),
    (N'Rice Bran Essence', 'innisfree-rice-essence', N'Tinh chất cám gạo', 395000, 450000, 1, 2, 'da-hon-hop', 'images/SP/I022.jpg', 45, 4.6),
    (N'Perfume Perfector', 'innisfree-perfume', N'Xịt dưỡng thơm', 255000, NULL, 4, 2, 'all', 'images/SP/I023.jpg', 40, 4.5),
    (N'Hair Loss Care', 'innisfree-hair-care', N'Dầu gội chống rụng tóc', 185000, NULL, 5, 2, 'all', 'images/SP/I024.jpg', 65, 4.4),
    (N'Innisfree Perfume', 'innisfree-perfume-bottle', N'Nước hoa Innisfree', 1250000, 1500000, 4, 2, 'all', 'images/SP/I025.jpg', 20, 4.7),
    (N'Capsule Foundation', 'innisfree-foundation', N'Phấn nền capsule', 425000, NULL, 2, 2, 'all', 'images/SP/I026.jpg', 45, 4.6),
    (N'Blush Powder', 'innisfree-blush', N'Phấn má hồng', 265000, NULL, 2, 2, 'all', 'images/SP/I027.jpg', 55, 4.5),
    (N'Lip Bar', 'innisfree-lip-bar', N'Son dưỡng môi', 185000, 220000, 2, 2, 'all', 'images/SP/I028.jpg', 80, 4.7),
    (N'Cushion Limited', 'innisfree-cushion-limited', N'Cushion phiên bản giới hạn', 485000, NULL, 2, 2, 'all', 'images/SP/I029.jpg', 30, 4.9),
    (N'Mint Shampoo', 'innisfree-mint-shampoo', N'Dầu gội bạc hà', 165000, NULL, 5, 2, 'all', 'images/SP/I030.jpg', 75, 4.6);

-- MAC (MaThuongHieu=3)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'MAC Studio Fix Fluid', 'mac-studio-fix-fluid', N'Phấn nền lỏng che phủ cao', 550000, 650000, 2, 3, 'all', 'images/SP/M001.jpg', 50, 4.8),
    (N'MAC Ruby Woo', 'mac-ruby-woo', N'Son môi Ruby Woo nổi tiếng', 385000, NULL, 2, 3, 'all', 'images/SP/M002.jpg', 90, 4.9),
    (N'MAC Chili', 'mac-chili', N'Son môi Chili', 385000, NULL, 2, 3, 'all', 'images/SP/M003.jpg', 85, 4.8),
    (N'MAC Fix+ Spray', 'mac-fix-spray', N'Xịt cố định lớp trang điểm', 345000, 420000, 2, 3, 'all', 'images/SP/M004.jpg', 60, 4.9),
    (N'MAC Prep Prime', 'mac-prep-prime', N'Kem lót dưỡng da', 425000, NULL, 2, 3, 'all', 'images/SP/M005.jpg', 50, 4.7),
    (N'MAC Pro Longwear', 'mac-pro-longwear', N'Phấn nền lâu trôi', 525000, 620000, 2, 3, 'da-dau', 'images/SP/M006.jpg', 40, 4.8),
    (N'MAC Mineralize', 'mac-mineralize', N'Phấn nền khoáng', 495000, NULL, 2, 3, 'da-nhay-cam', 'images/SP/M007.jpg', 45, 4.7),
    (N'MAC Paint Pot', 'mac-paint-pot', N'Phấn lót mắt đa năng', 345000, NULL, 2, 3, 'all', 'images/SP/M008.jpg', 60, 4.9),
    (N'MAC Eye Shadow', 'mac-eye-shadow', N'Phấn mắt đơn sắc', 285000, 350000, 2, 3, 'all', 'images/SP/M009.jpg', 75, 4.8),
    (N'MAC Palette', 'mac-palette', N'Bảng phấn mắt 12 màu', 685000, NULL, 2, 3, 'all', 'images/SP/M010.jpg', 30, 4.9),
    (N'MAC Blush', 'mac-blush', N'Phấn má hồng khoáng', 365000, NULL, 2, 3, 'all', 'images/SP/M011.jpg', 55, 4.8),
    (N'MAC Concealer', 'mac-concealer', N'Che khuyết điểm che phủ', 325000, NULL, 2, 3, 'all', 'images/SP/M012.jpg', 65, 4.9),
    (N'MAC Lipglass', 'mac-lipglass', N'Son bóng', 365000, 420000, 2, 3, 'all', 'images/SP/M013.jpg', 55, 4.8),
    (N'MAC Matte Lipstick', 'mac-matte-lipstick', N'Son lì matte', 385000, NULL, 2, 3, 'all', 'images/SP/M014.jpg', 80, 4.9),
    (N'MAC Brow Pencil', 'mac-brow-pencil', N'Bút chì lông mày', 285000, NULL, 2, 3, 'all', 'images/SP/M015.jpg', 65, 4.8),
    (N'MAC Zoom Lash', 'mac-zoom-lash', N'Mascara tăng cường mi', 385000, NULL, 2, 3, 'all', 'images/SP/M016.jpg', 65, 4.8),
    (N'MAC Chromographic', 'mac-chromographic', N'Bút kẻ mắt nước chống nước', 285000, NULL, 2, 3, 'all', 'images/SP/M017.jpg', 70, 4.7),
    (N'MAC Pro Eye Paint', 'mac-pro-eye-paint', N'Kẻ mắt dạng kem', 325000, 380000, 2, 3, 'all', 'images/SP/M018.jpg', 55, 4.6),
    (N'MAC Setting Powder', 'mac-setting-powder', N'Phấn phủ mịn màng', 445000, NULL, 2, 3, 'da-dau', 'images/SP/M019.jpg', 45, 4.8),
    (N'MAC Strobe Cream', 'mac-strobe-cream', N'Kem highlight lấp lánh', 465000, NULL, 2, 3, 'all', 'images/SP/M020.jpg', 45, 4.8),
    (N'MAC Lip Pencil', 'mac-lip-pencil', N'Bút kẻ môi', 245000, NULL, 2, 3, 'all', 'images/SP/M021.jpg', 70, 4.7),
    (N'MAC Satin Lipstick', 'mac-satin-lipstick', N'Son satin mịn màng', 385000, NULL, 2, 3, 'all', 'images/SP/M022.jpg', 75, 4.8),
    (N'MAC Cremesheen', 'mac-cremesheen', N'Son crem sheen dưỡng', 385000, NULL, 2, 3, 'all', 'images/SP/M023.jpg', 70, 4.7),
    (N'MAC Brow Gel', 'mac-brow-gel', N'Gel lông mày', 325000, 380000, 2, 3, 'all', 'images/SP/M024.jpg', 50, 4.7),
    (N'MAC Cleanse', 'mac-cleanse', N'Nước tẩy trang MAC', 445000, NULL, 3, 3, 'all', 'images/SP/M025.jpg', 40, 4.6),
    (N'MAC Retro', 'mac-retro-lipstick', N'Son môi Retro', 385000, NULL, 2, 3, 'all', 'images/SP/M026.jpg', 80, 4.9),
    (N'MAC Face and Body', 'mac-face-body', N'Phấn nền cho body và mặt', 485000, NULL, 2, 3, 'all', 'images/SP/M027.jpg', 45, 4.7),
    (N'MAC Studio Sculpt', 'mac-studio-sculpt', N'Phấn nền dạng kem', 515000, NULL, 2, 3, 'da-kho', 'images/SP/M028.jpg', 40, 4.8),
    (N'MAC Mineralize Blush', 'mac-mineralize-blush', N'Phấn má khoáng bóng', 395000, 450000, 2, 3, 'all', 'images/SP/M029.jpg', 50, 4.7),
    (N'MAC False Lash', 'mac-false-lash', N'Mascara giả mi', 425000, NULL, 2, 3, 'all', 'images/SP/M030.jpg', 50, 4.7);

-- DIOR (MaThuongHieu=4)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Dior Addict Lipstick', 'dior-addict-lipstick', N'Son Dior Addict', 550000, 650000, 2, 4, 'all', 'images/SP/D001.jpg', 50, 4.9),
    (N'Dior Backstage Eye Palette', 'dior-eye-palette', N'Bảng mắt Dior Backstage', 685000, NULL, 2, 4, 'all', 'images/SP/D002.jpg', 35, 4.9),
    (N'Dior Foundation', 'dior-foundation', N'Phấn nền Dior Forever', 750000, 850000, 2, 4, 'all', 'images/SP/D003.jpg', 40, 4.8),
    (N'Miss Dior', 'dior-miss-dior', N'Nước hoa Miss Dior', 1650000, NULL, 4, 4, 'all', 'images/SP/D004.jpg', 25, 4.8),
    (N'Dior Sauvage', 'dior-sauvage', N'Nước hoa nam Dior Sauvage', 1850000, NULL, 4, 4, 'all', 'images/SP/D005.jpg', 30, 4.9),
    (N'Dior Capture Totale', 'dior-capture-totale', N'Kem dưỡng chống lão hóa', 1850000, 2200000, 1, 4, 'da-kho', 'images/SP/D006.jpg', 20, 4.9),
    (N'Dior Hydra Life', 'dior-hydra-life', N'Kem dưỡng ẩm Dior Hydra Life', 925000, NULL, 1, 4, 'da-kho', 'images/SP/D007.jpg', 25, 4.7),
    (N'Dior J''adore', 'dior-jadore', N'Nước hoa J''adore', 1950000, NULL, 4, 4, 'all', 'images/SP/D008.jpg', 20, 4.9),
    (N'Dior Lip Oil', 'dior-lip-oil', N'Dầu dưỡng môi Dior', 425000, 500000, 2, 4, 'all', 'images/SP/D009.jpg', 55, 4.8),
    (N'Dior Forever Concealer', 'dior-concealer', N'Che khuyết điểm Dior', 485000, NULL, 2, 4, 'all', 'images/SP/D010.jpg', 45, 4.9),
    (N'Dior Prestige Cream', 'dior-prestige', N'Kem dưỡng cao cấp Dior', 2250000, NULL, 1, 4, 'da-kho', 'images/SP/D011.jpg', 15, 4.9),
    (N'Dior Poison', 'dior-poison', N'Nước hoa Poison', 1450000, NULL, 4, 4, 'all', 'images/SP/D012.jpg', 18, 4.7),
    (N'Dior Eye Cream', 'dior-eye-cream', N'Kem dưỡng mắt Dior', 925000, NULL, 1, 4, 'all', 'images/SP/D013.jpg', 30, 4.8),
    (N'Dior Face Primer', 'dior-primer', N'Kem lót Dior', 625000, 750000, 2, 4, 'all', 'images/SP/D014.jpg', 40, 4.8),
    (N'Dior Bronzer', 'dior-bronzer', N'Phấn tạo tông nâu', 545000, NULL, 2, 4, 'all', 'images/SP/D015.jpg', 30, 4.6),
    (N'Dior Serum Essence', 'dior-serum', N'Tinh chất serum Dior', 1150000, NULL, 1, 4, 'da-kho', 'images/SP/D016.jpg', 25, 4.9),
    (N'Dior Toner', 'dior-toner', N'Nước hoa hồng Dior', 485000, NULL, 1, 4, 'all', 'images/SP/D017.jpg', 40, 4.6),
    (N'Dior Cleansing', 'dior-cleansing', N'Sữa rửa mặt Dior', 525000, 620000, 3, 4, 'all', 'images/SP/D018.jpg', 35, 4.7),
    (N'Dior Mask', 'dior-mask', N'Mặt nạ Dior', 685000, NULL, 1, 4, 'da-kho', 'images/SP/D019.jpg', 25, 4.8),
    (N'Dior Body Cream', 'dior-body-cream', N'Kem dưỡng thể Dior', 785000, NULL, 1, 4, 'da-kho', 'images/SP/D020.jpg', 30, 4.7),
    (N'Dior Hand Cream', 'dior-hand-cream', N'Kem dưỡng tay Dior', 385000, NULL, 1, 4, 'da-kho', 'images/SP/D021.jpg', 50, 4.6),
    (N'Dior Hair Perfume', 'dior-hair-perfume', N'Nước hoa tóc Dior', 625000, NULL, 5, 4, 'all', 'images/SP/D022.jpg', 35, 4.7),
    (N'Dior Shampoo', 'dior-shampoo', N'Dầu gội Dior', 485000, NULL, 5, 4, 'all', 'images/SP/D023.jpg', 30, 4.5),
    (N'Dior Lip Balm', 'dior-lip-balm', N'Son dưỡng môi Dior', 325000, NULL, 2, 4, 'all', 'images/SP/D024.jpg', 60, 4.8),
    (N'Dior Palette Holiday', 'dior-palette-holiday', N'Bảng mắt Holiday', 985000, NULL, 2, 4, 'all', 'images/SP/D025.jpg', 20, 4.9),
    (N'Dior Forever Cushion', 'dior-cushion', N'Cushion Dior Forever', 685000, NULL, 2, 4, 'all', 'images/SP/D026.jpg', 35, 4.7),
    (N'Dior Addict Gloss', 'dior-gloss', N'Son bóng Dior', 420000, NULL, 2, 4, 'all', 'images/SP/D027.jpg', 50, 4.8),
    (N'Dior Mono Eyeshadow', 'dior-mono', N'Phấn mắt đơn sắc', 285000, NULL, 2, 4, 'all', 'images/SP/D028.jpg', 40, 4.6),
    (N'Dior Eyeliner Pen', 'dior-eyeliner', N'Bút kẻ mắt Dior', 315000, NULL, 2, 4, 'all', 'images/SP/D029.jpg', 45, 4.7),
    (N'Dior Brow Styler', 'dior-brow', N'Bút kẻ mày Dior', 285000, NULL, 2, 4, 'all', 'images/SP/D030.jpg', 50, 4.8);

-- THE ORDINARY (MaThuongHieu=5)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Niacinamide 10% + Zinc 1%', 'to-niacinamide', N'Serum dưỡng da mụn', 195000, 250000, 1, 5, 'da-dau', 'images/SP/O001.jpg', 100, 4.8),
    (N'Hyaluronic Acid 2% + B5', 'to-ha-b5', N'Serum cấp ẩm phục hồi', 210000, NULL, 1, 5, 'all', 'images/SP/O002.jpg', 85, 4.7),
    (N'AHA 30% + BHA 2% Peeling', 'to-peeling', N'Tẩy tế bào chết hóa học', 245000, 300000, 3, 5, 'da-hon-hop', 'images/SP/O003.jpg', 60, 4.9),
    (N'Caffeine Solution 5%', 'to-caffeine', N'Serum trị quầng thâm mắt', 225000, NULL, 1, 5, 'all', 'images/SP/O004.jpg', 55, 4.6),
    (N'Natural Moisturizing Factors', 'to-nmf', N'Kem dưỡng ẩm tự nhiên', 185000, 220000, 1, 5, 'da-kho', 'images/SP/O005.jpg', 70, 4.5),
    (N'Glycolic Acid 7% Toning', 'to-glycolic', N'Toner tẩy da chết Glycolic', 320000, NULL, 1, 5, 'all', 'images/SP/O006.jpg', 40, 4.7),
    (N'Alpha Arbutin 2% + HA', 'to-alpha', N'Serum mờ thâm làm sáng', 285000, NULL, 1, 5, 'all', 'images/SP/O007.jpg', 65, 4.8),
    (N'Squalane Cleanser', 'to-squalane', N'Sữa rửa mặt Squalane', 265000, NULL, 3, 5, 'da-nhay-cam', 'images/SP/O008.jpg', 50, 4.6),
    (N'Multi-Peptide Buffet', 'to-buffet', N'Serum Buffet chống lão hóa', 450000, 520000, 1, 5, 'all', 'images/SP/O009.jpg', 30, 4.9),
    (N'Lactic Acid 10% + HA', 'to-lactic', N'Serum tẩy da chết Lactic', 235000, NULL, 1, 5, 'da-kho', 'images/SP/O010.jpg', 45, 4.7),
    (N'Retinol 0.5% in Squalane', 'to-retinol', N'Retinol 0.5% ngừa lão hóa', 245000, NULL, 1, 5, 'all', 'images/SP/O011.jpg', 35, 4.8),
    (N'Vitamin C Suspension 23%', 'to-vitc-23', N'Vitamin C sáng da', 215000, NULL, 1, 5, 'all', 'images/SP/O012.jpg', 50, 4.4),
    (N'Rose Hip Seed Oil', 'to-rose-hip', N'Dầu nụ tầm xuân dưỡng da', 310000, NULL, 1, 5, 'da-kho', 'images/SP/O013.jpg', 40, 4.8),
    (N'Azelaic Acid 10%', 'to-azelaic', N'Azelaic Acid giảm mụn đỏ', 275000, NULL, 1, 5, 'da-dau', 'images/SP/O014.jpg', 60, 4.7),
    (N'Salicylic Acid Masque', 'to-bha-mask', N'Mặt nạ BHA thanh lọc da', 350000, NULL, 3, 5, 'da-dau', 'images/SP/O015.jpg', 45, 4.8),
    (N'Matrixyl 10% + HA', 'to-matrixyl', N'Serum Matrixyl mờ nếp nhăn', 380000, NULL, 1, 5, 'all', 'images/SP/O016.jpg', 25, 4.7),
    (N'Amino Acids + B5', 'to-amino', N'Serum Amino Acids dưỡng da', 240000, NULL, 1, 5, 'all', 'images/SP/O017.jpg', 40, 4.6),
    (N'Granactive Retinoid 2%', 'to-retinoid', N'Retinoid thế hệ mới', 330000, NULL, 1, 5, 'all', 'images/SP/O018.jpg', 35, 4.8),
    (N'Borage Seed Oil', 'to-borage', N'Dầu hạt Borage làm dịu', 215000, NULL, 1, 5, 'da-nhay-cam', 'images/SP/O019.jpg', 30, 4.5),
    (N'Argireline 10%', 'to-argireline', N'Serum Argireline xóa nhăn', 270000, NULL, 1, 5, 'all', 'images/SP/O020.jpg', 40, 4.7),
    (N'Niacinamide Powder', 'to-powder', N'Bột Niacinamide tinh khiết', 220000, NULL, 1, 5, 'da-dau', 'images/SP/O021.jpg', 50, 4.6),
    (N'Pycnogenol 5%', 'to-pycnogenol', N'Serum chống oxy hóa mạnh', 310000, NULL, 1, 5, 'all', 'images/SP/O022.jpg', 20, 4.8),
    (N'Resveratrol 3% + Ferulic', 'to-resveratrol', N'Serum bảo vệ da toàn diện', 265000, NULL, 1, 5, 'all', 'images/SP/O023.jpg', 30, 4.7),
    (N'Hemi-Squalane', 'to-hemi', N'Dầu Hemi-Squalane mỏng nhẹ', 165000, NULL, 5, 5, 'all', 'images/SP/O024.jpg', 55, 4.5),
    (N'Lash Serum', 'to-lash', N'Serum dưỡng dài mi', 420000, NULL, 1, 5, 'all', 'images/SP/O025.jpg', 40, 4.9),
    (N'Ascorbyl Glucoside 12%', 'to-vitc-liquid', N'Dẫn xuất Vitamin C sáng da', 360000, NULL, 1, 5, 'all', 'images/SP/O026.jpg', 35, 4.7),
    (N'EUK 134 0.1%', 'to-euk', N'Serum tự tái tạo oxy', 290000, NULL, 1, 5, 'all', 'images/SP/O027.jpg', 20, 4.6),
    (N'Mineral UV SPF 30', 'to-sun', N'Kem chống nắng vật lý', 320000, NULL, 1, 5, 'da-nhay-cam', 'images/SP/O028.jpg', 40, 4.3),
    (N'Hair Serum Peptide', 'to-hair', N'Serum kích thích mọc tóc', 540000, 650000, 5, 5, 'all', 'images/SP/O029.jpg', 25, 4.8),
    (N'Vitamin C Powder 100%', 'to-vitc-powder', N'Bột Vitamin C tinh khiết', 195000, NULL, 1, 5, 'all', 'images/SP/O030.jpg', 45, 4.7);

-- LA ROCHE-POSAY (MaThuongHieu=6)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Effaclar Duo Plus', 'lrp-duo-plus', N'Kem giảm mụn thâm', 425000, 495000, 1, 6, 'da-dau', 'images/SP/LR001.jpg', 80, 4.9),
    (N'Effaclar Gel', 'lrp-gel', N'Gel rửa mặt cho da dầu', 355000, NULL, 3, 6, 'da-dau', 'images/SP/LR002.jpg', 120, 4.8),
    (N'Cicaplast Baume B5', 'lrp-b5', N'Kem phục hồi làm dịu da', 315000, 360000, 1, 6, 'da-nhay-cam', 'images/SP/LR003.jpg', 150, 4.9),
    (N'Anthelios Invisible Fluid', 'lrp-sun-fluid', N'Kem chống nắng dạng lỏng', 465000, 520000, 1, 6, 'all', 'images/SP/LR004.jpg', 100, 4.9),
    (N'Hyalu B5 Serum', 'lrp-hyalu-b5', N'Serum cấp ẩm săn chắc da', 850000, 990000, 1, 6, 'all', 'images/SP/LR005.jpg', 40, 4.8),
    (N'Pure Vitamin C10', 'lrp-vit-c', N'Serum Vitamin C làm sáng', 920000, NULL, 1, 6, 'all', 'images/SP/LR006.jpg', 35, 4.7),
    (N'Toleriane Sensitive Cream', 'lrp-toleriane', N'Kem dưỡng cho da nhạy cảm', 445000, NULL, 1, 6, 'da-nhay-cam', 'images/SP/LR007.jpg', 60, 4.6),
    (N'Effaclar Mat', 'lrp-mat', N'Kem dưỡng kiềm dầu', 385000, NULL, 1, 6, 'da-dau', 'images/SP/LR008.jpg', 50, 4.5),
    (N'Micellar Water Ultra', 'lrp-micellar', N'Nước tẩy trang dịu nhẹ', 395000, 450000, 3, 6, 'da-nhay-cam', 'images/SP/LR009.jpg', 90, 4.8),
    (N'Lipikar Baume AP+M', 'lrp-lipikar', N'Kem dưỡng giảm ngứa da', 580000, NULL, 1, 6, 'da-kho', 'images/SP/LR010.jpg', 45, 4.9),
    (N'Serozinc Spray', 'lrp-serozinc', N'Xịt khoáng kiềm dầu', 285000, NULL, 1, 6, 'da-dau', 'images/SP/LR011.jpg', 70, 4.7),
    (N'Cicaplast Mains', 'lrp-hand', N'Kem phục hồi da tay', 225000, NULL, 1, 6, 'da-kho', 'images/SP/LR012.jpg', 60, 4.8),
    (N'Cicaplast Levres', 'lrp-lip', N'Kem phục hồi môi nứt nẻ', 185000, NULL, 1, 6, 'all', 'images/SP/LR013.jpg', 100, 4.7),
    (N'Effaclar Serum Peel', 'lrp-peel', N'Serum tẩy tế bào chết hóa học', 820000, 950000, 1, 6, 'da-dau', 'images/SP/LR014.jpg', 30, 4.9),
    (N'Effaclar H Iso-Biome', 'lrp-iso-biome', N'Kem dưỡng ẩm da mụn yếu', 415000, NULL, 1, 6, 'da-dau', 'images/SP/LR015.jpg', 40, 4.8),
    (N'Pigmentclar Serum', 'lrp-pigment', N'Serum đặc trị nám thâm', 1050000, NULL, 1, 6, 'all', 'images/SP/LR016.jpg', 20, 4.6),
    (N'Hydreane Light', 'lrp-hydreane', N'Kem dưỡng ẩm hàng ngày', 365000, NULL, 1, 6, 'da-hon-hop', 'images/SP/LR017.jpg', 45, 4.5),
    (N'Lipikar Oil Cleanser', 'lrp-oil', N'Dầu tắm làm sạch da khô', 495000, NULL, 3, 6, 'da-kho', 'images/SP/LR018.jpg', 35, 4.7),
    (N'Anthelios Sun Stick', 'lrp-stick', N'Sáp chống nắng tiện dụng', 325000, NULL, 1, 6, 'all', 'images/SP/LR019.jpg', 50, 4.6),
    (N'Posthelios After Sun', 'lrp-after-sun', N'Kem làm dịu sau nắng', 415000, NULL, 1, 6, 'all', 'images/SP/LR020.jpg', 30, 4.8),
    (N'Kerium DS Shampoo', 'lrp-shampoo', N'Dầu gội trị gàu mảng', 385000, NULL, 5, 6, 'all', 'images/SP/LR021.jpg', 40, 4.7),
    (N'Cicaplast Spray B5', 'lrp-spray', N'Xịt phục hồi da B5', 345000, NULL, 1, 6, 'da-nhay-cam', 'images/SP/LR022.jpg', 55, 4.8),
    (N'Rosaliac AR Intense', 'lrp-rosaliac', N'Kem giảm mẩn đỏ da', 625000, NULL, 1, 6, 'da-nhay-cam', 'images/SP/LR023.jpg', 25, 4.5),
    (N'Anthelios Kids Lotion', 'lrp-kids', N'Sữa chống nắng cho trẻ em', 485000, NULL, 1, 6, 'all', 'images/SP/LR024.jpg', 35, 4.9),
    (N'Toleriane Teint Base', 'lrp-base', N'Kem lót che khuyết điểm', 525000, NULL, 2, 6, 'da-nhay-cam', 'images/SP/LR025.jpg', 30, 4.7),
    (N'Toleriane Foaming', 'lrp-foam', N'Sữa rửa mặt tạo bọt dịu nhẹ', 395000, NULL, 3, 6, 'da-dau', 'images/SP/LR026.jpg', 60, 4.6),
    (N'Uvidea Anthelios Tone-Up', 'lrp-tone-up', N'Kem chống nắng nâng tông', 545000, 620000, 1, 6, 'all', 'images/SP/LR027.jpg', 40, 4.8),
    (N'Cicaplast Gel B5', 'lrp-gel-b5', N'Gel làm mờ sẹo phục hồi', 335000, NULL, 1, 6, 'all', 'images/SP/LR028.jpg', 45, 4.7),
    (N'Lipikar Syndet AP+', 'lrp-syndet', N'Sữa tắm dưỡng ẩm da khô', 425000, NULL, 3, 6, 'da-kho', 'images/SP/LR029.jpg', 50, 4.8),
    (N'Anthelios Tinted Fluid', 'lrp-tinted', N'Kem chống nắng có màu', 475000, NULL, 1, 6, 'all', 'images/SP/LR030.jpg', 35, 4.7);

-- COCOON (MaThuongHieu=7)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Tẩy da chết Cà phê Body', 'cocoon-coffee-body', N'Tẩy tế bào chết toàn thân', 165000, 210000, 3, 7, 'all', 'images/SP/C001.jpg', 200, 4.9),
    (N'Nước hoa hồng Sen Hậu Giang', 'cocoon-toner-sen', N'Nước hoa hồng dưỡng ẩm', 175000, NULL, 1, 7, 'all', 'images/SP/C002.jpg', 120, 4.7),
    (N'Serum Bí Đao', 'cocoon-serum-bidao', N'Serum bí đao giảm mụn', 265000, 295000, 1, 7, 'da-dau', 'images/SP/C003.jpg', 100, 4.8),
    (N'Gel rửa mặt Bí Đao', 'cocoon-cleanser-bidao', N'Gel rửa mặt bí đao dịu nhẹ', 155000, NULL, 3, 7, 'da-dau', 'images/SP/C004.jpg', 140, 4.8),
    (N'Tinh dầu bưởi mọc tóc', 'cocoon-pomelo', N'Kích thích mọc tóc Cocoon', 145000, NULL, 5, 7, 'all', 'images/SP/C005.jpg', 180, 4.9),
    (N'Thạch hoa hồng dưỡng ẩm', 'cocoon-rose-gel', N'Thạch dưỡng ẩm hoa hồng', 185000, NULL, 1, 7, 'da-kho', 'images/SP/C006.jpg', 80, 4.7),
    (N'Mặt nạ Nghệ Hưng Yên', 'cocoon-turmeric-mask', N'Mặt nạ nghệ làm sáng da', 325000, NULL, 1, 7, 'all', 'images/SP/C007.jpg', 70, 4.8),
    (N'Nước tẩy trang Hoa Hồng', 'cocoon-rose-water', N'Nước tẩy trang hoa hồng hữu cơ', 245000, NULL, 3, 7, 'all', 'images/SP/C008.jpg', 110, 4.7),
    (N'Son dưỡng Dừa Bến Tre', 'cocoon-coconut-lip', N'Son dưỡng ẩm dừa', 35000, 45000, 2, 7, 'all', 'images/SP/C009.jpg', 300, 4.9),
    (N'Cao vỏ bưởi dưỡng tóc', 'cocoon-pomelo-cream', N'Kem ủ bưởi phục hồi tóc', 165000, NULL, 5, 7, 'all', 'images/SP/C010.jpg', 90, 4.6),
    (N'Tẩy da chết Môi Cà phê', 'cocoon-coffee-lip', N'Tẩy tế bào chết môi', 75000, NULL, 3, 7, 'all', 'images/SP/C011.jpg', 250, 4.8),
    (N'Mặt nạ Bí Đao', 'cocoon-winter-melon-mask', N'Mặt nạ bí đao thanh lọc da', 145000, NULL, 1, 7, 'da-dau', 'images/SP/C012.jpg', 85, 4.8),
    (N'Dầu gội bưởi không Sulfate', 'cocoon-pomelo-shampoo', N'Dầu gội ngăn rụng tóc', 225000, NULL, 5, 7, 'all', 'images/SP/C013.jpg', 130, 4.7),
    (N'Dầu xả bưởi phục hồi', 'cocoon-pomelo-conditioner', N'Dầu xả bưởi Cocoon', 225000, NULL, 5, 7, 'all', 'images/SP/C014.jpg', 130, 4.7),
    (N'Nước dưỡng tóc Sa-chi', 'cocoon-sachi-hair', N'Xịt dưỡng tóc Sa-chi', 125000, NULL, 5, 7, 'all', 'images/SP/C015.jpg', 100, 4.5),
    (N'Serum Nghệ Hưng Yên', 'cocoon-turmeric-serum', N'Serum nghệ x3 sáng da', 295000, 350000, 1, 7, 'all', 'images/SP/C016.jpg', 60, 4.8),
    (N'Tẩy da chết Cà phê Mặt', 'cocoon-coffee-face', N'Tẩy tế bào chết da mặt', 145000, NULL, 3, 7, 'all', 'images/SP/C017.jpg', 150, 4.9),
    (N'Nước tẩy trang sen Hậu Giang', 'cocoon-sen-mist', N'Nước tẩy trang cân bằng da', 135000, NULL, 1, 7, 'all', 'images/SP/C018.jpg', 140, 4.6),
    (N'Bơ dưỡng thể Đắk Lắk', 'cocoon-coffee-butter', N'Bơ body cà phê', 185000, NULL, 1, 7, 'da-kho', 'images/SP/C019.jpg', 90, 4.8),
    (N'Gel tắm khuynh diệp & bạc hà ', 'cocoon-body-wash', N'Gel tắm khuynh diệp & bạc hà ', 215000, NULL, 3, 7, 'all', 'images/SP/C020.jpg', 100, 4.7),
    (N'Kem dưỡng Nghệ Hưng Yên', 'cocoon-turmeric-cream', N'Kem nghệ dưỡng sáng', 285000, NULL, 1, 7, 'all', 'images/SP/C021.jpg', 55, 4.7),
    (N'Nước cân bằng Bí Đao', 'cocoon-winter-melon-toner', N'Toner bí đao kiểm soát dầu', 165000, NULL, 1, 7, 'da-dau', 'images/SP/C022.jpg', 90, 4.8),
    (N'Gel tắm Bí Đao', 'cocoon-winter-melon-wash', N'Gel tắm mụn lưng', 195000, NULL, 3, 7, 'da-dau', 'images/SP/C023.jpg', 120, 4.8),
    (N'Mặt nạ Hoa Hồng dưỡng ẩm', 'cocoon-rose-mask', N'Mặt nạ cánh hoa hồng', 145000, NULL, 1, 7, 'da-kho', 'images/SP/C024.jpg', 80, 4.7),
    (N'Nước dưỡng tóc sa-chi phục hồi', 'cocoon-sachi-shampoo', N'Xịt dưỡng tóc sa-chi phục hồi', 245000, NULL, 5, 7, 'all', 'images/SP/C025.jpg', 100, 4.6),
    (N'Serum Sa-chi dưỡng tóc', 'cocoon-sachi-serum', N'Serum tóc Sa-chi', 155000, NULL, 5, 7, 'all', 'images/SP/C026.jpg', 95, 4.7),
    (N'Xà phòng Cà phê', 'cocoon-coffee-soap', N'Xà phòng bánh cà phê', 55000, NULL, 3, 7, 'all', 'images/SP/C027.jpg', 200, 4.8),
    (N'Kem tay Sen Hậu Giang', 'cocoon-sen-hand', N'Kem dưỡng da tay sen', 85000, NULL, 1, 7, 'all', 'images/SP/C028.jpg', 150, 4.5),
    (N'Cao bí đao trị mụn', 'cocoon-winter-melon-cao', N'Cao bí đao truyền thống', 95000, NULL, 1, 7, 'da-dau', 'images/SP/C029.jpg', 70, 4.8),
    (N'Nước tẩy trang Bí Đao 500ml', 'cocoon-bidao-water-large', N'Tẩy trang bí đao size lớn', 275000, 320000, 3, 7, 'da-dau', 'images/SP/C030.jpg', 100, 4.9);

-- GARNIER (MaThuongHieu=8)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Micellar Hồng', 'garnier-micellar-pink', N'Tẩy trang cho da nhạy cảm', 165000, 195000, 3, 8, 'da-nhay-cam', 'images/SP/G001.jpg', 250, 4.9),
    (N'Micellar Vàng Oil', 'garnier-micellar-oil', N'Tẩy trang lớp trang điểm đậm', 185000, NULL, 3, 8, 'all', 'images/SP/G002.jpg', 200, 4.8),
    (N'Serum Vitamin C sáng da', 'garnier-vitc-serum', N'Serum Vitamin C x30', 255000, 310000, 1, 8, 'all', 'images/SP/G003.jpg', 150, 4.8),
    (N'Bright Complete Wash', 'garnier-bright-wash', N'Sữa rửa mặt sáng da', 115000, NULL, 3, 8, 'all', 'images/SP/G004.jpg', 180, 4.7),
    (N'Serum Cream SPF30', 'garnier-serum-cream', N'Kem dưỡng sáng ban ngày', 195000, NULL, 1, 8, 'all', 'images/SP/G005.jpg', 100, 4.6),
    (N'Serum Mask Sakura', 'garnier-Sakura-mask', N'Mặt nạ hoa anh đào', 32000, 45000, 1, 8, 'all', 'images/SP/G006.jpg', 500, 4.9),
    (N'Serum Mask Vitamin C', 'garnier-vitc-mask', N'Mặt nạ trắng da Vitamin C', 32000, 45000, 1, 8, 'all', 'images/SP/G007.jpg', 500, 4.9),
    (N'Bright Complete Night', 'garnier-night-cream', N'Kem dưỡng trắng ban đêm', 215000, NULL, 1, 8, 'all', 'images/SP/G008.jpg', 90, 4.7),
    (N'AHA/BHA Serum', 'garnier-aha-bha', N'Serum giảm mụn Garnier', 285000, 350000, 1, 8, 'da-dau', 'images/SP/G009.jpg', 70, 4.8),
    (N'Lân khử mùi Mineral', 'garnier-deo', N'Lăn khoáng Garnier', 85000, NULL, 1, 8, 'all', 'images/SP/G010.jpg', 300, 4.5),
    (N'Serum chống nắng SPF50', 'garnier-sun-serum', N'Kem chống nắng mỏng nhẹ', 235000, NULL, 1, 8, 'all', 'images/SP/G011.jpg', 110, 4.7),
    (N'Micellar Blue', 'garnier-micellar-blue', N'Tẩy trang da dầu mụn', 165000, NULL, 3, 8, 'da-dau', 'images/SP/G012.jpg', 180, 4.8),
    (N'Kem trị mụn nhanh', 'garnier-acne', N'Chấm mụn Garnier', 145000, NULL, 1, 8, 'da-dau', 'images/SP/G013.jpg', 95, 4.6),
    (N'Serum Mask Green Tea', 'garnier-tea-mask', N'Mặt nạ trà xanh kiềm dầu', 32000, NULL, 1, 8, 'da-dau', 'images/SP/G014.jpg', 400, 4.7),
    (N'Serum Mask Lavender', 'garnier-lavender-mask', N'Mặt nạ hoa oải hương', 32000, NULL, 1, 8, 'all', 'images/SP/G015.jpg', 350, 4.8),
    (N'Serum Vitamin C ban đêm', 'garnier-night-serum', N'Serum Vitamin C phục hồi đêm', 295000, 360000, 1, 8, 'all', 'images/SP/G016.jpg', 65, 4.9),
    (N'Sữa rửa mặt Acne', 'garnier-acne-wash', N'Sữa rửa mặt trị mụn', 125000, NULL, 3, 8, 'da-dau', 'images/SP/G017.jpg', 130, 4.7),
    (N'Serum Mask Charcoal', 'garnier-charcoal-mask', N'Mặt nạ than tre', 35000, NULL, 3, 8, 'da-dau', 'images/SP/G018.jpg', 200, 4.8),
    (N'Sữa dưỡng thể Bright', 'garnier-body-lotion', N'Sữa dưỡng thể sáng da', 175000, NULL, 1, 8, 'all', 'images/SP/G019.jpg', 110, 4.7),
    (N'Thuốc nhuộm đen', 'garnier-hair-black', N'Thuốc nhuộm tóc màu đen', 45000, NULL, 5, 8, 'all', 'images/SP/G020.jpg', 150, 4.4),
    (N'Thuốc nhuộm nâu', 'garnier-hair-brown', N'Thuốc nhuộm tóc màu nâu', 45000, NULL, 5, 8, 'all', 'images/SP/G021.jpg', 150, 4.5),
    (N'Kem dưỡng ẩm Aqua Bomb', 'garnier-aqua-bomb', N'Kem dưỡng ẩm chuyên sâu', 285000, NULL, 1, 8, 'da-kho', 'images/SP/G022.jpg', 50, 4.7),
    (N'Mặt nạ mắt cam', 'garnier-eye-orange', N'Mặt nạ mắt giảm bọng cam', 35000, NULL, 1, 8, 'all', 'images/SP/G023.jpg', 300, 4.8),
    (N'Mặt nạ mắt dừa', 'garnier-eye-coconut', N'Mặt nạ mắt dưỡng ẩm dừa', 35000, NULL, 1, 8, 'all', 'images/SP/G024.jpg', 300, 4.8),
    (N'Gel dưỡng Sakura', 'garnier-sakura-gel', N'Gel dưỡng ẩm Sakura', 185000, NULL, 1, 8, 'all', 'images/SP/G025.jpg', 80, 4.7),
    (N'Micellar nắp vàng', 'garnier-micellar-peeling', N'Tẩy trang làm sạch sâu nắp vàng', 195000, NULL, 3, 8, 'all', 'images/SP/G026.jpg', 120, 4.8),
    (N'Xà phòng than tre', 'garnier-soap-charcoal', N'Xà phòng rửa mặt than tre', 95000, NULL, 3, 8, 'da-dau', 'images/SP/G027.jpg', 100, 4.6),
    (N'Tẩy da chết hạt mơ', 'garnier-apricot-scrub', N'Tẩy tế bào chết hạt mơ', 135000, NULL, 3, 8, 'all', 'images/SP/G028.jpg', 110, 4.5),
    (N'Sữa dưỡng Sakura', 'garnier-sakura-body', N'Sữa dưỡng thể hương anh đào', 175000, NULL, 1, 8, 'all', 'images/SP/G029.jpg', 90, 4.7),
    (N'Kem lót Blur', 'garnier-blur', N'Kem lót làm mờ lỗ chân lông', 225000, NULL, 2, 8, 'all', 'images/SP/G030.jpg', 70, 4.4);

-- YVES SAINT LAURENT (MaThuongHieu=9)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'The Slim Velvet Radical', 'ysl-the-slim', N'Son lì Velvet', 950000, 1100000, 2, 9, 'all', 'images/SP/Y001.jpg', 40, 4.9),
    (N'Libre EDP 50ml', 'ysl-libre-edp', N'Nước hoa YSL Libre', 2850000, 3200000, 4, 9, 'all', 'images/SP/Y002.jpg', 25, 4.9),
    (N'Le Cushion Encre De Peau', 'ysl-cushion', N'Cushion YSL', 1650000, 1850000, 2, 9, 'all', 'images/SP/Y003.jpg', 35, 4.8),
    (N'All Hours Foundation', 'ysl-foundation', N'Kem nền YSL', 1450000, NULL, 2, 9, 'all', 'images/SP/Y004.jpg', 30, 4.9),
    (N'Rouge Volupte Shine', 'ysl-shine', N'Son YSL Shine', 880000, NULL, 2, 9, 'all', 'images/SP/Y005.jpg', 50, 4.8),
    (N'Black Opium EDP', 'ysl-black-opium', N'Nước hoa Black Opium', 2750000, NULL, 4, 9, 'all', 'images/SP/Y006.jpg', 20, 4.9),
    (N'Pure Shots Night Reboot', 'ysl-pure-shots', N'Serum ban đêm Pure Shots', 2200000, 2500000, 1, 9, 'all', 'images/SP/Y007.jpg', 15, 4.9),
    (N'Touche Eclat Blur Primer', 'ysl-blur-primer', N'Kem lót Blur Primer', 1250000, NULL, 2, 9, 'all', 'images/SP/Y008.jpg', 20, 4.8),
    (N'Touche Eclat Concealer', 'ysl-concealer', N'Che khuyết điểm Touche Eclat', 950000, NULL, 2, 9, 'all', 'images/SP/Y009.jpg', 40, 4.7),
    (N'Mon Paris EDP', 'ysl-mon-paris', N'Nước hoa Mon Paris', 2650000, NULL, 4, 9, 'all', 'images/SP/Y010.jpg', 25, 4.8),
    (N'Vinyl Cream Lip Stain', 'ysl-vinyl', N'Son Vinyl Cream', 920000, NULL, 2, 9, 'all', 'images/SP/Y011.jpg', 45, 4.8),
    (N'Souffle D Eclat', 'ysl-powder', N'Phấn phủ Souffle D Eclat', 1350000, NULL, 2, 9, 'all', 'images/SP/Y012.jpg', 20, 4.7),
    (N'Volume Effet Faux Cils', 'ysl-mascara', N'Mascara YSL', 850000, NULL, 2, 9, 'all', 'images/SP/Y013.jpg', 30, 4.6),
    (N'YSL Y EDP For Men', 'ysl-y-edp', N'Nước hoa nam Y', 2850000, NULL, 4, 9, 'all', 'images/SP/Y014.jpg', 30, 4.9),
    (N'Perfect Plumper Cream', 'ysl-pure-cream', N'Kem dưỡng Pure Cream', 2100000, NULL, 1, 9, 'da-kho', 'images/SP/Y015.jpg', 15, 4.8),
    (N'YSL Shocking Liner', 'ysl-liner', N'Kẻ mắt Shocking Liner', 750000, NULL, 2, 9, 'all', 'images/SP/Y016.jpg', 30, 4.5),
    (N'Rouge Pur Couture', 'ysl-rouge', N'Son Rouge Pur Couture', 880000, NULL, 2, 9, 'all', 'images/SP/Y017.jpg', 40, 4.8),
    (N'La Nuit De L Homme', 'ysl-la-nuit', N'Nước hoa La Nuit', 2450000, NULL, 4, 9, 'all', 'images/SP/Y018.jpg', 20, 4.8),
    (N'Pure Shots Cleanse', 'ysl-wash', N'Sữa rửa mặt Pure Shots', 1200000, NULL, 3, 9, 'all', 'images/SP/Y019.jpg', 25, 4.7),
    (N'Pure Shots Eye', 'ysl-eye', N'Kem mắt Pure Shots', 1850000, NULL, 1, 9, 'all', 'images/SP/Y020.jpg', 15, 4.7),
    (N'Cinema EDP', 'ysl-cinema', N'Nước hoa Cinema', 2350000, NULL, 4, 9, 'all', 'images/SP/Y021.jpg', 10, 4.6),
    (N'Couture Blush', 'ysl-blush', N'Phấn má Couture Blush', 1150000, NULL, 2, 9, 'all', 'images/SP/Y022.jpg', 25, 4.8),
    (N'Couture Palette', 'ysl-palette', N'Bảng mắt Couture Palette', 1550000, NULL, 2, 9, 'all', 'images/SP/Y023.jpg', 15, 4.8),
    (N'Top Secrets Remover', 'ysl-top-secrets', N'Tẩy trang Top Secrets', 1100000, NULL, 3, 9, 'all', 'images/SP/Y024.jpg', 20, 4.7),
    (N'L Homme EDT', 'ysl-lhomme', N'Nước hoa L Homme', 2250000, NULL, 4, 9, 'all', 'images/SP/Y025.jpg', 15, 4.8),
    (N'Glow Mesh Cushion', 'ysl-mesh-cushion', N'Cushion Glow Mesh', 1750000, NULL, 2, 9, 'all', 'images/SP/Y026.jpg', 20, 4.9),
    (N'Candy Glaze Lip', 'ysl-candy', N'Son dưỡng Candy Glaze', 950000, NULL, 2, 9, 'all', 'images/SP/Y027.jpg', 35, 4.9),
    (N'Manifesto EDP', 'ysl-manifesto', N'Nước hoa Manifesto', 2650000, NULL, 4, 9, 'all', 'images/SP/Y028.jpg', 12, 4.7),
    (N'Kem tay YSL', 'ysl-hand', N'Kem dưỡng da tay YSL', 650000, NULL, 1, 9, 'all', 'images/SP/Y029.jpg', 30, 4.6),
    (N'Hydra Bounce Lotion', 'ysl-hydra', N'Nước hoa hồng Hydra Bounce', 1650000, NULL, 1, 9, 'all', 'images/SP/Y030.jpg', 20, 4.8);

-- CHANEL (MaThuongHieu=10)
INSERT INTO SanPham
    (TenSanPham, SlugSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, LoaiDa, LinkAnh, SoLuongKho, DanhGia)
VALUES
    (N'Chanel No.5 EDP', 'chanel-no5', N'Nước hoa Chanel No.5', 4200000, 4600000, 4, 10, 'all', 'images/SP/CH001.jpg', 10, 5.0),
    (N'Bleu de Chanel EDP', 'chanel-bleu', N'Nước hoa nam Bleu', 3500000, 3800000, 4, 10, 'all', 'images/SP/CH002.jpg', 15, 5.0),
    (N'Rouge Coco Lipstick', 'chanel-coco', N'Son Rouge Coco', 1050000, 1200000, 2, 10, 'all', 'images/SP/CH003.jpg', 30, 4.9),
    (N'Les Beiges Foundation', 'chanel-foundation', N'Kem nền Les Beiges', 1850000, NULL, 2, 10, 'all', 'images/SP/CH004.jpg', 20, 4.9),
    (N'Coco Mademoiselle', 'chanel-coco-mad', N'Nước hoa Coco Mademoiselle', 4100000, NULL, 4, 10, 'all', 'images/SP/CH005.jpg', 12, 5.0),
    (N'Hydra Beauty Creme', 'chanel-hydra', N'Kem dưỡng Hydra Beauty', 2200000, NULL, 1, 10, 'da-kho', 'images/SP/CH006.jpg', 15, 4.9),
    (N'Serum Le Lift', 'chanel-le-lift', N'Serum Le Lift', 4500000, NULL, 1, 10, 'all', 'images/SP/CH007.jpg', 10, 4.9),
    (N'Joues Contraste Blush', 'chanel-blush', N'Phấn má Chanel', 1350000, NULL, 2, 10, 'all', 'images/SP/CH008.jpg', 20, 4.8),
    (N'Le Volume de Chanel', 'chanel-mascara', N'Mascara Chanel', 950000, NULL, 2, 10, 'all', 'images/SP/CH009.jpg', 25, 4.8),
    (N'La Mousse Cleanser', 'chanel-mousse', N'Sữa rửa mặt Chanel', 1250000, 1450000, 3, 10, 'all', 'images/SP/CH010.jpg', 40, 4.9),
    (N'Chance Eau Tendre', 'chanel-chance', N'Nước hoa Chance', 3800000, NULL, 4, 10, 'all', 'images/SP/CH011.jpg', 18, 4.9),
    (N'Rouge Allure Ink', 'chanel-ink', N'Son kem Rouge Allure', 1100000, NULL, 2, 10, 'all', 'images/SP/CH012.jpg', 25, 4.8),
    (N'Poudre Universelle', 'chanel-powder', N'Phấn phủ Poudre Universelle', 1550000, NULL, 2, 10, 'all', 'images/SP/CH013.jpg', 20, 4.9),
    (N'Allure Homme Sport', 'chanel-allure-sport', N'Nước hoa Allure Homme', 3200000, NULL, 4, 10, 'all', 'images/SP/CH014.jpg', 20, 5.0),
    (N'Sublimage Eye Cream', 'chanel-eye', N'Kem mắt Sublimage', 5500000, NULL, 1, 10, 'all', 'images/SP/CH015.jpg', 8, 5.0),
    (N'Stylo Yeux Pencil', 'chanel-pencil', N'Chì kẻ mắt Chanel', 850000, NULL, 2, 10, 'all', 'images/SP/CH016.jpg', 30, 4.7),
    (N'Hydra Beauty Micro', 'chanel-micro-serum', N'Serum Hydra Micro', 3200000, NULL, 1, 10, 'all', 'images/SP/CH017.jpg', 12, 4.9),
    (N'Gabrielle Chanel', 'chanel-gabrielle', N'Nước hoa Gabrielle', 4250000, NULL, 4, 10, 'all', 'images/SP/CH018.jpg', 15, 4.9),
    (N'Huile Cleansing Oil', 'chanel-oil', N'Dầu tẩy trang Chanel', 1350000, NULL, 3, 10, 'all', 'images/SP/CH019.jpg', 20, 4.8),
    (N'Base Lumiere Primer', 'chanel-primer', N'Kem lót Base Lumiere', 1450000, NULL, 2, 10, 'all', 'images/SP/CH020.jpg', 20, 4.8),
    (N'Egoiste Platinum', 'chanel-egoiste', N'Nước hoa Egoiste Platinum', 3100000, NULL, 4, 10, 'all', 'images/SP/CH021.jpg', 10, 4.8),
    (N'Les 4 Ombres', 'chanel-eyeshadow', N'Bảng mắt Les 4 Ombres', 1750000, NULL, 2, 10, 'all', 'images/SP/CH022.jpg', 15, 4.9),
    (N'Chanel Brow Crayon', 'chanel-brow', N'Chì kẻ mày Chanel', 950000, NULL, 2, 10, 'all', 'images/SP/CH023.jpg', 25, 4.7),
    (N'Chanel Toner Lotion', 'chanel-toner', N'Nước hoa hồng Chanel', 1650000, NULL, 1, 10, 'all', 'images/SP/CH024.jpg', 20, 4.8),
    (N'Sublimage La Creme', 'chanel-sublimage', N'Kem dưỡng Sublimage', 9500000, NULL, 1, 10, 'all', 'images/SP/CH025.jpg', 5, 5.0),
    (N'Son dưỡng Chanel Boy', 'chanel-boy-lip', N'Son dưỡng nam Chanel Boy', 1050000, NULL, 2, 10, 'all', 'images/SP/CH026.jpg', 20, 4.8),
    (N'Chanel Gommage Scrub', 'chanel-scrub', N'Tẩy da chết Chanel', 1550000, NULL, 3, 10, 'all', 'images/SP/CH027.jpg', 15, 4.8),
    (N'Sycomore Exclusif', 'chanel-sycomore', N'Nước hoa Sycomore', 6500000, NULL, 4, 10, 'all', 'images/SP/CH028.jpg', 5, 5.0),
    (N'La Creme Main', 'chanel-hand', N'Kem dưỡng tay Chanel', 1450000, NULL, 1, 10, 'all', 'images/SP/CH029.jpg', 25, 4.9),
    (N'Chanel No.19', 'chanel-no19', N'Nước hoa Chanel No.19', 3950000, NULL, 4, 10, 'all', 'images/SP/CH030.jpg', 10, 4.8);

ALTER TABLE SanPham CHECK CONSTRAINT ALL;
GO

-- 7. CHÈN KHÁCH HÀNG & MÃ GIẢM GIÁ
INSERT INTO KhachHang
    (HoTen, Email, MatKhau, SoDienThoai, VaiTro)
VALUES
    (N'Đinh Quốc Thanh', 'quocthanh2614@gmail.com', '123456', '0702932614', 'admin'),
    (N'Trần Thị Thanh Tâm', 'thanhtam@gmail.com', '123456', '0912345678', 'customer');

INSERT INTO MaGiamGia
    (MaCode, MoTa, PhanTramGiam, DonHangToiThieu, MienPhiVanChuyen)
VALUES
    ('SALE10', N'Giảm 10% đơn từ 500K', 10, 500000, 0),
    ('FREESHIP', N'Miễn phí vận chuyển đơn từ 300K', 0, 300000, 1);
GO

-- 8. KIỂM TRA KẾT QUẢ
SELECT 'Dữ liệu đã nạp thành công!' AS ThongBao;
SELECT COUNT(*) AS TongSoSanPham
FROM SanPham;


INSERT INTO MaGiamGia
    (MaCode, MoTa, PhanTramGiam, DonHangToiThieu, MienPhiVanChuyen, NgayBatDau, NgayKetThuc)
VALUES
    ('SALE10', N'Giảm 10% đơn hàng từ 500K', 10, 500000, 0, '2024-01-01', '2024-12-31'),
    ('SAVE20', N'Giảm 20% đơn hàng từ 1 triệu', 20, 1000000, 0, '2024-01-01', '2024-12-31'),
    ('WELCOME5', N'Giảm 5% cho khách hàng mới', 5, 0, 0, '2024-01-01', '2024-12-31'),
    ('FREESHIP', N'Miễn phí vận chuyển đơn từ 300K', 0, 300000, 1, '2024-01-01', '2024-12-31'),
    ('THANHTAM15', N'Giảm 15% đơn hàng từ 800K', 15, 800000, 0, '2024-01-01', '2024-12-31');
GO
