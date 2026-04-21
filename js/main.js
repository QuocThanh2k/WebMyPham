// ==================== [HERO BANNER FEATURE] ====================

// 🔧 CONFIGURABLE: Edit these dates yearly for Tet/Gio To
const TET_NGUYEN_DAN = '01-29';    // e.g., 2026: Jan 29 → Update yearly
const GIO_TO_HUNG_VUONG = '04-10'; // e.g., 2026: Apr 10 → Update yearly

const EVENTS_CONFIG = [
    {
        dates: ['01-01'], daysBefore: 3,
        badgeText: '🎉 Tết Dương Lịch',
        title: 'Năm Mới Rạng Rỡ',
        description: 'Bắt đầu năm mới với làn da tươi trẻ, bộ sưu tập dưỡng da & trang điểm mới nhất!'
    },
    {
        dates: ['01-09'], daysBefore: 2,
        badgeText: '📚 Ngày HS-SV',
        title: 'Tuổi Trẻ Tươi Sáng',
        description: 'Skincare routine hoàn hảo cho làn da học đường, tự tin tỏa sáng mọi lúc!'
    },
    {
        dates: ['02-14'], daysBefore: 3,
        badgeText: '💕 Valentine',
        title: 'Tình Yêu Đong Đầy',
        description: 'Son môi quyến rũ, nước hoa tỏa hương - món quà hoàn hảo cho ngày Valentine!'
    },
    {
        dates: ['03-08'], daysBefore: 3,
        badgeText: '🌸 Ngày Phụ Nữ 8/3',
        title: 'Phụ Nữ Rạng Ngời',
        description: 'Quà tặng skincare cao cấp dành riêng cho phái đẹp - đẹp từ trong ra ngoài!'
    },
    {
        dates: ['03-20'], daysBefore: 2,
        badgeText: '😊 Ngày Hạnh Phúc',
        title: 'Hạnh Phúc Rạng Tỏa',
        description: 'Bộ dưỡng da giúp bạn luôn tươi trẻ, nụ cười rạng rỡ mỗi ngày!'
    },
    {
        dates: ['03-26'], daysBefore: 2,
        badgeText: '👏 Thành Lập Đoàn',
        title: 'Tuổi Trẻ Việt Nam',
        description: 'Chăm sóc da tự nhiên, sản phẩm an toàn dành cho thế hệ trẻ năng động!'
    },
    {
        dates: ['04-30', '05-01'], daysBefore: 3,
        badgeText: '🇻🇳 Ngày Giải Phóng',
        title: 'Tự Hào Việt Nam',
        description: 'Ưu đãi đặc biệt dịp lễ lớn - làm đẹp chuẩn Việt, giá chuẩn Việt!'
    },
    {
        dates: ['05-07'], daysBefore: 2,
        badgeText: '⚔️ Điện Biên Phủ',
        title: 'Anh Hùng Rực Rỡ',
        description: 'Sản phẩm chăm sóc da mạnh mẽ, bền bỉ như tinh thần dân tộc!'
    },
    {
        dates: ['06-01'], daysBefore: 3,
        badgeText: '👶 Quốc Tế Thiếu Nhi',
        title: 'Bé Yêu Xinh Đẹp',
        description: 'Dòng sản phẩm an toàn, dịu nhẹ dành riêng cho làn da bé yêu!'
    },
    {
        dates: ['06-28'], daysBefore: 2,
        badgeText: '👨‍👩‍👧‍👦 Ngày Gia Đình',
        title: 'Gia Đình Hạnh Phúc',
        description: 'Bộ quà tặng làm đẹp cho cả nhà - chăm sóc từ mẹ đến con!'
    },
    {
        dates: ['09-02'], daysBefore: 3,
        badgeText: '🎊 Quốc Khánh 2/9',
        title: 'Việt Nam Rực Rỡ',
        description: "Ưu đãi 'Mỹ phẩm Việt - Giá Việt' dịp lễ Quốc Khánh!"
    },
    {
        dates: ['10-20'], daysBefore: 3,
        badgeText: '💃 Phụ Nữ VN 20/10',
        title: 'Nữ Giới Việt Nam',
        description: 'Trang điểm & skincare cao cấp - tôn vinh vẻ đẹp phụ nữ Việt!'
    },
    {
        dates: ['11-20'], daysBefore: 3,
        badgeText: '👩‍🏫 Ngày Nhà Giáo',
        title: 'Cô Giáo Xinh Đẹp',
        description: 'Quà tặng mỹ phẩm cao cấp tri ân những người thầy cô đáng kính!'
    },
    {
        dates: ['12-24', '12-25'], daysBefore: 3,
        badgeText: '🎄 Giáng Sinh',
        title: 'Christmas Glow',
        description: 'Makeup lấp lánh, dưỡng da phát sáng - sẵn sàng cho đêm Noel!'
    },
    // 🔧 SPECIAL EVENTS - Configurable yearly
    {
        dates: [TET_NGUYEN_DAN], daysBefore: 5,
        badgeText: '🐉 Tết Nguyên Đán',
        title: 'Tết Rực Rỡ',
        description: 'Bộ sưu tập trang điểm Tết + dưỡng da đón Xuân mới!'
    },

    {
        dates: [GIO_TO_HUNG_VUONG], daysBefore: 3,
        badgeText: '🏔️ Giỗ Tổ Hùng Vương',
        title: 'Nguồn Cội Việt',
        description: 'Mỹ phẩm thiên nhiên thuần Việt - tự hào nguồn cội!'
    }
];

// DEFAULT CONTENT (fallback khi không có lễ)
const DEFAULT_CONTENT = {
    badgeText: '✨ Mùa Hè 2025',
    title: 'Rạng Rỡ Mỗi Ngày<br>Cùng Thanh Tâm',
    description: 'Khám phá bộ sưu tập mỹ phẩm cao cấp và chăm sóc da mới nhất từ các thương hiệu hàng đầu thế giới.'
};

/**
 * 🎯 MAIN FUNCTION: Auto-update hero banner based on current date + holiday config
 * Clean, configurable, safe DOM updates with fallback
 */
function updateHeroBanner() {
    // 1. Get today date (MM-DD format)
    const today = new Date();
    const currentDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    console.log(`🌅 Hero Banner: Checking date ${currentDate}...`);

    // 2. Find matching event (±daysBefore window)
    let matchedEvent = null;
    for (const event of EVENTS_CONFIG) {
        for (const eventDate of event.dates) {
            const eventDay = new Date(today.getFullYear(), parseInt(eventDate.split('-')[0]) - 1, parseInt(eventDate.split('-')[1]));
            const diffDays = Math.floor((today - eventDay) / (1000 * 60 * 60 * 24));

            if (diffDays <= 0 && diffDays >= -event.daysBefore) {
                matchedEvent = event;
                console.log(`✅ MATCH: ${event.badgeText} (${diffDays} days to ${eventDate})`);
                break;
            }
        }
        if (matchedEvent) break;
    }

    // 3. Get content (event or default)
    const content = matchedEvent || DEFAULT_CONTENT;

    // 4. Safe DOM update (elements may not exist on non-homepage)
    const badgeEl = document.querySelector('.hero-badge');
    const titleEl = document.querySelector('.hero-title');
    const descEl = document.querySelector('.hero-description');

    if (badgeEl) {
        badgeEl.textContent = content.badgeText;
    }
    if (titleEl) {
        titleEl.innerHTML = content.title;  // Allow <br> tags
    }
    if (descEl) {
        descEl.textContent = content.description;
    }

    // 5. Log result
    const pageType = document.querySelector('.hero') ? 'Homepage' : 'Other page';
    console.log(`🎨 Hero Banner updated (${pageType}):`, content.badgeText);
}

// 🕒 AUTO-RUN: On page load + daily refresh (ignores time changes)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeroBanner);
} else {
    updateHeroBanner();  // Already loaded
}

// Optional: Refresh every 24h (rarely needed for static dates)
setTimeout(() => {
    setInterval(updateHeroBanner, 24 * 60 * 60 * 1000);
}, 1000);

// 🔧 UTILITY: Test function - override date for testing (remove in production)
// window.testHeroBanner = (month, day) => {
//     const testDate = new Date();
//     testDate.setMonth(month - 1);
//     testDate.setDate(day);
//     Object.defineProperty(Date.prototype, 'getMonth', { value: () => testDate.getMonth() });
//     Object.defineProperty(Date.prototype, 'getDate', { value: () => testDate.getDate() });
//     updateHeroBanner();
// };

// Export globally for manual testing
window.updateHeroBanner = updateHeroBanner;
window.EVENTS_CONFIG = EVENTS_CONFIG;
window.DEFAULT_CONTENT = DEFAULT_CONTENT;

// ==================== [END OF HERO BANNER FEATURE] ====================

// ==================== AUTH FUNCTIONS ====================
/**
 * Handle account icon click - check login status & redirect
 */
function handleAccountClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        // Đã đăng nhập → Trang cá nhân
        window.location.href = 'profile.html';
    } else {
        // Chưa đăng nhập → Trang đăng nhập
        window.location.href = 'login.html';
    }
}

/**
 * Update account label with userName if logged in (advanced feature)
 */
function updateAccountDisplay() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    const accountLabel = document.querySelector('.header-actions .action-item .label');

    if (isLoggedIn && userName && accountLabel) {
        accountLabel.textContent = userName;
    }
}

// Enhance existing DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    updateHeroBannerByMonth();  // Existing
    updateAccountDisplay();     // NEW: User display
});


// ===== NEW: Monthly Hero Banner (as requested) =====
function updateHeroBannerByMonth() {
    // new Date().getMonth() trả về từ 0 (Tháng 1) đến 11 (Tháng 12)
    const currentMonth = new Date().getMonth();

    // Cấu hình nội dung cho 12 tháng
    const monthlyContent = [
        { badge: "Chào Năm Mới", title: "Khởi Đầu Rạng Rỡ<br>Cùng Thanh Tâm", desc: "Dưỡng da căng mướt, tự tin đón một năm mới ngập tràn may mắn." }, // Tháng 1
        { badge: "Lễ Tình Nhân", title: "Ngọt Ngào Mùa Yêu<br>Cùng Thanh Tâm", desc: "Khám phá những món quà làm đẹp hoàn hảo dành tặng người thương." }, // Tháng 2
        { badge: "Tôn vinh Phái Đẹp", title: "Tự Tin Tỏa Sáng<br>Tháng Của Nàng", desc: "Yêu thương bản thân hơn mỗi ngày với bộ sưu tập mỹ phẩm cao cấp." }, // Tháng 3
        { badge: "Đón Nắng Đầu Mùa", title: "Chuẩn Bị Làn Da<br>Đón Nắng Hè", desc: "Bảo vệ và phục hồi làn da rạng rỡ trước khi bước vào mùa hè sôi động." }, // Tháng 4
        { badge: "Rực Rỡ Chào Hè", title: "Tỏa Sáng Dưới Nắng<br>Cùng Thanh Tâm", desc: "Cập nhật ngay các dòng kem chống nắng và dưỡng da mỏng nhẹ mùa hè." }, // Tháng 5
        { badge: "Mùa Du Lịch", title: "Đẹp Rạng Ngời<br>Mọi Chuyến Đi", desc: "Những bảo bối làm đẹp nhỏ gọn, tiện lợi không thể thiếu trong vali của bạn." }, // Tháng 6
        { badge: "Giữa Mùa Hè", title: "Cấp Ẩm Tức Thì<br>Giữ Vẻ Tươi Trẻ", desc: "Giải nhiệt làn da với các sản phẩm cấp nước, kiềm dầu hiệu quả." }, // Tháng 7
        { badge: "Cuối Thu", title: "Dưỡng Da Mùa Thu<br>Cùng Thanh Tâm", desc: "Chăm sóc làn da chuyển mùa, giữ mãi vẻ căng bóng và tươi mới." }, // Tháng 8
        { badge: "Tháng Yêu Thương", title: "Quà Tặng Tinh Tế<br>Trao Gửi Yêu Thương", desc: "Gợi ý những set mỹ phẩm cao cấp làm quà tặng ý nghĩa." }, // Tháng 9
        { badge: "Phụ Nữ Việt Nam", title: "Vẻ Đẹp Á Đông<br>Tự Tin Tỏa Sáng", desc: "Tôn vinh sắc đẹp phụ nữ Việt với những ưu đãi đặc biệt tháng 10." }, // Tháng 10
        { badge: "Tri Ân Thầy Cô", title: "Món Quà Tri Ân<br>Gửi Ngàn Lời Cảm Ơn", desc: "Lựa chọn quà tặng mỹ phẩm tinh tế thay lời tri Ân tháng 11." }, // Tháng 11
        { badge: "Mùa Lễ Hội", title: "Lộng Lẫy Đêm Tiệc<br>Mùa Giáng Sinh", desc: "Tỏa sáng rực rỡ nhất trong các bữa tiệc cuối năm với makeup look ấn tượng." }  // Tháng 12
    ];

    // Lấy nội dung của tháng hiện tại
    const content = monthlyContent[currentMonth];

    // Tìm các phần tử HTML cần thay đổi
    const badgeEl = document.querySelector('.hero-badge');
    const titleEl = document.querySelector('.hero-title');
    const descEl = document.querySelector('.hero-description');

    // Nếu tìm thấy phần tử thì cập nhật nội dung
    if (badgeEl) badgeEl.innerHTML = `<i class="fas fa-sparkles"></i> ${content.badge}`;
    if (titleEl) titleEl.innerHTML = content.title;
    if (descEl) descEl.innerHTML = content.desc;
}
// ===== END MONTHLY HERO BANNER =====

// 🔥 SHRINK HEADER EFFECT - User Request
let ticking = false;

function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
    } else {
        header.classList.remove('is-scrolled');
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(handleHeaderScroll);
        ticking = true;
    }
});

// Trigger on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleHeaderScroll);
} else {
    handleHeaderScroll();
}


// Existing DOMContentLoaded handler continues below...

