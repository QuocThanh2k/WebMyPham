<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration - UPDATE THESE WITH YOUR DB DETAILS
$host = 'localhost';
$dbname = 'ThanhtamCosmetics';
$username = 'root';  // Default XAMPP/MySQL
$password = '';      // Default XAMPP (empty)

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$conn->set_charset('utf8mb4');

// Queries for inventory stats
$total_sql = "SELECT COALESCE(SUM(StockQuantity), 0) as total FROM Products WHERE IsActive = 1";
$low_stock_sql = "SELECT COUNT(*) as low_stock FROM Products WHERE StockQuantity > 0 AND StockQuantity < 10 AND IsActive = 1";
$expired_sql = "SELECT COUNT(*) as expired FROM Products WHERE ExpiryDate IS NOT NULL AND ExpiryDate <= DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND IsActive = 1";

$total_result = $conn->query($total_sql);
$low_result = $conn->query($low_stock_sql);
$expired_result = $conn->query($expired_sql);

$data = [
    'total' => $total_result ? $total_result->fetch_assoc()['total'] : 0,
    'low_stock' => $low_result ? $low_result->fetch_assoc()['low_stock'] : 0,
    'expired' => $expired_result ? $expired_result->fetch_assoc()['expired'] : 0
];

echo json_encode($data);

$conn->close();
?>
