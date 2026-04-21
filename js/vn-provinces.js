// VN Provinces/Districts for profile addresses (mock top provinces)
const VN_PROVINCES = [
    {
        code: 'HCM_NEW',
        name: 'TP. Hồ Chí Minh (Mới)',
        districts: [
            { name: 'Quận 1', wards: ['Tân Định', 'Đa Kao', 'Bến Nghé', 'Bến Thành', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão', 'Cầu Ông Lãnh', 'Cô Giang', 'Cầu Kho', 'Nguyễn Cư Trinh'] },
            { name: 'Huyện Bình Chánh', wards: ['Thị trấn Tân Túc', 'An Phú Tây', 'Bình Chánh', 'Bình Hưng', 'Bình Lợi', 'Đa Phước', 'Hưng Long', 'Lê Minh Xuân', 'Phạm Văn Hai', 'Phong Phú', 'Quy Đức', 'Tân Kiên', 'Tân Nhựt', 'Tân Quý Tây', 'Vĩnh Lộc A', 'Vĩnh Lộc B'] },
            { name: 'Huyện Cần Giờ', wards: ['Thị trấn Cần Thạnh', 'An Thới Đông', 'Bình Khánh', 'Hiệp Phước', 'Lý Nhơn', 'Tam Thôn Hiệp', 'Thạnh An'] },
            { name: 'Thành phố Thủ Dầu Một', wards: ['Chánh Mỹ', 'Chánh Nghĩa', 'Định Hòa', 'Hiệp An', 'Hiệp Thành', 'Hòa Phú', 'Phú Cường', 'Phú Hòa', 'Phú Lợi', 'Phú Mỹ', 'Phú Tân', 'Phú Thọ', 'Tân An', 'Tương Bình Hiệp'] },
            { name: 'Thành phố Vũng Tàu', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Thắng Nhất', 'Thắng Nhì', 'Thắng Tam', 'Rạch Dừa', 'Long Sơn'] }
        ]
    },
    {
        code: 'CT_NEW',
        name: 'TP. Cần Thơ (Mới)',
        districts: [
            { name: 'Quận Ninh Kiều', wards: ['An Bình', 'An Cư', 'An Hòa', 'An Khánh', 'An Nghiệp', 'An Phú', 'Cái Khế', 'Hưng Lợi', 'Tân An', 'Thới Bình', 'Xuân Khánh'] },
            { name: 'Huyện Phong Điền', wards: ['Thị trấn Phong Điền', 'Giai Xuân', 'Mỹ Khánh', 'Nhơn Nghĩa', 'Nhơn Ái', 'Tân Thới', 'Trường Long'] },
            { name: 'Thành phố Vị Thanh', wards: ['Phường I', 'Phường III', 'Phường IV', 'Phường V', 'Phường VII', 'Hỏa Lựu', 'Hỏa Tiến', 'Tân Tiến', 'Vị Tân'] },
            { name: 'Thành phố Sóc Trăng', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10'] }
        ]
    },
    {
        code: 'AG_NEW',
        name: 'Tỉnh An Giang (Mới)',
        districts: [
            { name: 'Thành phố Long Xuyên', wards: ['Mỹ Bình', 'Mỹ Long', 'Mỹ Xuyên', 'Mỹ Hòa Hưng', 'Mỹ Khánh'] },
            { name: 'Thành phố Rạch Giá', wards: ['Vĩnh Thanh Vân', 'Vĩnh Thanh', 'Vĩnh Lạc', 'Phi Thông'] },
            { name: 'Huyện Phú Quốc', wards: ['Phường Dương Đông', 'Phường An Thới', 'Bãi Thơm', 'Cửa Cạn', 'Cửa Dương', 'Dương Tơ', 'Gành Dầu', 'Hàm Ninh', 'Thổ Châu'] }
        ]
    },
    {
        code: 'DT_NEW',
        name: 'Tỉnh Đồng Tháp (Mới)',
        districts: [
            { name: 'Thành phố Cao Lãnh', wards: ['Hòa An', 'Mỹ Ngãi', 'Mỹ Tân', 'Mỹ Trà', 'Tân Thuận Đông', 'Tân Thuận Tây', 'Tịnh Thới'] },
            { name: 'Thành phố Mỹ Tho', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Đạo Thạnh', 'Trung An', 'Tân Mỹ Chánh', 'Thới Sơn', 'Phước Thạnh', 'Mỹ Phong'] }
        ]
    },
    {
        code: 'CM_NEW',
        name: 'Tỉnh Cà Mau (Mới)',
        districts: [
            { name: 'Thành phố Cà Mau', wards: ['Phường 1', 'Phường 10', 'An Xuyên', 'Định Bình', 'Hòa Tân', 'Hòa Thành', 'Lý Văn Lâm', 'Tân Thành', 'Tắc Vân'] },
            { name: 'Thành phố Bạc Liêu', wards: ['Phường 1', 'Phường 7', 'Hiệp Thành', 'Vĩnh Trạch', 'Vĩnh Trạch Đông'] }
        ]
    }];
// Export for profile.js
window.VN_PROVINCES = VN_PROVINCES;

