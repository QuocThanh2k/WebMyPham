<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$dbname = 'ThanhtamCosmetics';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8mb4');

$filter_type = $_GET['filter_type'] ?? 'all';

try {
    // Summary queries (reuse from get-inventory-summary.php logic)
    $total_sql = "SELECT COALESCE(SUM(SoLuongKho), 0) as all FROM SanPham WHERE DangHoatDong = 1";
    $low_stock_sql = "SELECT COUNT(*) as low_stock FROM SanPham WHERE SoLuongKho > 0 AND SoLuongKho < 10 AND DangHoatDong = 1";
$expiring_sql = "SELECT COUNT(*) as expiring FROM SanPham WHERE DATEDIFF(HanSuDung, CURDATE()) <= 90 AND DATEDIFF(HanSuDung, CURDATE()) > 0 AND DangHoatDong = 1";

    $total_result = $conn->query($total_sql);
    $low_result = $conn->query($low_stock_sql);
    $expiring_result = $conn->query($expiring_sql);

    $summary = [
        'all' => $total_result ? $total_result->fetch_assoc()['all'] : 0,
        'low_stock' => $low_result ? $low_result->fetch_assoc()['low_stock'] : 0,
        'expiring' => $expiring_result ? $expiring_result->fetch_assoc()['expiring'] : 0
    ];

    // Products query with filter
    $where_conditions = ['DangHoatDong = 1'];
    $params = [];

    switch ($filter_type) {
        case 'low_stock':
            $where_conditions[] = 'SoLuongKho > 0 AND SoLuongKho < 10';
            break;
        case 'expiring':
            $where_conditions[] = 'DATEDIFF(HanSuDung, CURDATE()) <= 90 AND DATEDIFF(HanSuDung, CURDATE()) > 0';
            break;
        case 'all':
        default:
            break;
    }

    $where_clause = implode(' AND ', $where_conditions);
    $sql = "SELECT MaSanPham as id, TenSanPham as name, MaDanhMuc as category, MaThuongHieu as brand_id, SoLuongKho as stock, Gia as price, LinkAnh as image, NgayNhapHang as import_date, HanSuDung as expiry_date FROM SanPham WHERE $where_clause ORDER BY CASE WHEN HanSuDung IS NOT NULL THEN DATEDIFF(HanSuDung, CURDATE()) ELSE 999 END ASC, SoLuongKho ASC LIMIT 100";

    $products_result = $conn->query($sql);
    $products = [];

    if ($products_result) {
        while ($row = $products_result->fetch_assoc()) {
            $stock = (int)$row['stock'];
            $products[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'category' => $row['category'], // Map in JS if needed
                'stock' => $stock,
                'expiry_date' => $row['expiry_date'] ?: 'N/A',
                'status_text' => $stock <= 0 ? 'Hết hàng' : ($stock < 10 ? 'Sắp hết' : 'Còn hàng'),
                'status_class' => $stock <= 0 ? 'danger' : ($stock < 10 ? 'warning' : 'success'),
                'image' => $row['image'] ?: 'images/SP/default.jpg'
            ];
        }
    }

    echo json_encode([
        'summary' => $summary,
        'products' => $products
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>

