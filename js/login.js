// ==================== DEFAULT USERS ====================

// Khởi tạo tài khoản mặc định vào localStorage nếu chưa có
function initDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra nếu chưa có tài khoản nào
    if (users.length === 0) {
        const defaultUsers = [
            {
                id: 1,
                name: "Đinh Quốc Thanh",
                email: "quocthanh2614@gmail.com",
                phone: "0702932614",
                password: "123456",
                role: "admin",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Trần Thị Thanh Tâm",
                email: "thanhtam@gmail.com",
                phone: "0912345678",
                password: "123456",
                role: "customer",
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('Đã khởi tạo tài khoản mặc định');
    }
}

// Hiển thị danh sách tài khoản mặc định
function displayDefaultAccounts() {
    const accountsList = document.getElementById('defaultAccountsList');
    if (!accountsList) return;

    const defaultAccounts = [
        { email: "quocthanh2614@gmail.com", password: "123456", name: "Đinh Quốc Thanh (Admin)" },
        { email: "thanhtam@gmail.com", password: "123456", name: "Trần Thị Thanh Tâm" }
    ];

    let html = '';
    defaultAccounts.forEach(account => {
        html += `
            <div class="account-item" onclick="fillAccount('${account.email}', '${account.password}')">
                <div class="account-icon"><i class="fas fa-user"></i></div>
                <div class="account-info">
                    <div class="account-name">${account.name}</div>
                    <div class="account-email">${account.email}</div>
                </div>
                <div class="account-action"><i class="fas fa-sign-in-alt"></i></div>
            </div>
        `;
    });
    accountsList.innerHTML = html;
}

// Điền thông tin tài khoản vào form đăng nhập
function fillAccount(email, password) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
}

// Gọi hàm khởi tạo khi trang được tải
initDefaultUsers();
displayDefaultAccounts();

// Switch between login, register, and forgot password
function switchTab(tab) {
    const tabs = document.querySelectorAll('.auth-tabs button');
    const forms = document.querySelectorAll('.auth-form');

    // Lấy các element của tab ẩn
    const registerTabBtn = document.getElementById('registerTabBtn');
    const forgotTabBtn = document.getElementById('forgotTabBtn');

    // Lấy các element của Banner bên trái
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerDesc = document.getElementById('bannerDesc');
    const bannerBtn = document.getElementById('bannerBtn');

    // Xóa class active của tất cả các tab và form
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => {
        f.classList.remove('active');
        f.style.display = '';
    });

    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');

        if (registerTabBtn) registerTabBtn.style.display = 'none';
        if (forgotTabBtn) forgotTabBtn.style.display = 'none';

        // ĐỔI NỘI DUNG BANNER THÀNH ĐĂNG KÝ
        if (bannerTitle) {
            bannerTitle.textContent = 'Chào Mừng!';
            bannerDesc.textContent = 'Đăng nhập để nhận nhiều ưu đãi đặc biệt';
            bannerBtn.textContent = 'ĐĂNG KÝ NGAY';
            bannerBtn.setAttribute('onclick', "switchTab('register')");
        }

    } else if (tab === 'register') {
        if (registerTabBtn) {
            registerTabBtn.style.display = 'block';
            registerTabBtn.classList.add('active');
        }
        document.getElementById('registerForm').classList.add('active');
        if (forgotTabBtn) forgotTabBtn.style.display = 'none';

        // ĐỔI NỘI DUNG BANNER THÀNH ĐĂNG NHẬP
        if (bannerTitle) {
            bannerTitle.textContent = 'Chào Trở Lại!';
            bannerDesc.textContent = 'Đã có tài khoản? Hãy đăng nhập để mua sắm';
            bannerBtn.textContent = 'ĐĂNG NHẬP NGAY';
            bannerBtn.setAttribute('onclick', "switchTab('login')");
        }

    } else if (tab === 'forgot') {
        const loginEmailValue = document.getElementById('loginEmail').value.trim();
        const forgotEmailInput = document.getElementById('forgotEmail');
        if (loginEmailValue) {
            forgotEmailInput.value = loginEmailValue;
        }

        if (forgotTabBtn) {
            forgotTabBtn.style.display = 'block';
            forgotTabBtn.classList.add('active');
        }
        document.getElementById('forgotForm').classList.add('active');
        if (registerTabBtn) registerTabBtn.style.display = 'none';

        forgotEmailInput.focus();
        if (typeof validateForgotPassword === 'function') validateForgotPassword();
    }
}

// Forgot Password Validation Functions
function validateForgotPassword() {
    const email = document.getElementById('forgotEmail').value.trim();
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const btn = document.getElementById('forgotBtn');

    // Validation elements
    const emailValidEl = document.getElementById('emailValid');
    const pwValidEl = document.getElementById('pwValid');
    const confirmValidEl = document.getElementById('confirmValid');

    let isValid = true;

    // 1. Email: not empty
    if (!email) {
        emailValidEl.textContent = 'Email không được để trống ❌';
        emailValidEl.className = 'validation-msg error-msg';
        isValid = false;
    } else {
        emailValidEl.innerHTML = 'Email hợp lệ ✓';
        emailValidEl.className = 'validation-msg success-msg';
    }

    // 2. Password: >=8 chars + 1 uppercase + 1 number (STRICT REQ)
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!newPass) {
        pwValidEl.textContent = 'Mật khẩu không được để trống ❌';
        pwValidEl.className = 'validation-msg error-msg';
        isValid = false;
    } else if (!passRegex.test(newPass)) {
        pwValidEl.innerHTML = '≥8 ký tự, 1 HOA + 1 SỐ (VD: Thanh123) ❌';
        pwValidEl.className = 'validation-msg error-msg';
        isValid = false;
    } else {
        pwValidEl.innerHTML = `Mật khẩu hợp lệ ✓ (${newPass.length} chars)`;
        pwValidEl.className = 'validation-msg success-msg';
    }

    // 3. Confirm match
    if (!confirmPass) {
        confirmValidEl.textContent = 'Xác nhận không được để trống ❌';
        confirmValidEl.className = 'validation-msg error-msg';
        isValid = false;
    } else if (newPass !== confirmPass) {
        confirmValidEl.textContent = 'Không khớp ❌';
        confirmValidEl.className = 'validation-msg error-msg';
        isValid = false;
    } else {
        confirmValidEl.innerHTML = 'Khớp 100% ✓';
        confirmValidEl.className = 'validation-msg success-msg';
    }

    // 4. Button control + Thanh Tam pink (REQ)
    if (isValid) {
        btn.disabled = false;
        btn.classList.add('active');
        btn.style.backgroundColor = '#e91e63';
        btn.style.cursor = 'pointer';
        btn.innerHTML = '✅ ĐẶT LẠI MẬT KHẨU';
    } else {
        btn.disabled = true;
        btn.classList.remove('active');
        btn.style.backgroundColor = '#ccc';
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = 'ĐẶT LẠI MẬT KHẨU';
    }

    return isValid;
}

function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('forgotEmail').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Final validation
    if (!validateForgotPassword()) {
        showToast('Vui lòng kiểm tra lại thông tin!', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        showToast('Email không tồn tại trong hệ thống!', 'error');
        return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    showToast('✅ Đặt lại mật khẩu thành công! Đang chuyển về trang chủ...', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Add real-time listeners
document.addEventListener('DOMContentLoaded', function () {
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        // Debounced validation for better UX
        let timeout;
        function debouncedValidate() {
            clearTimeout(timeout);
            timeout = setTimeout(validateForgotPassword, 300);
        }

        const emailInput = document.getElementById('forgotEmail');
        const pwInput = document.getElementById('newPassword');
        const confirmInput = document.getElementById('confirmPassword');

        // Attach to ALL 3 fields (REQ #3 real-time)
        [emailInput, pwInput, confirmInput].forEach(input => {
            input.addEventListener('input', debouncedValidate);
        });

        // Initial validation
        validateForgotPassword();
    }
});

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.password-toggle i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'far fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'far fa-eye';
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (!email || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    // Save to localStorage (demo)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save current user
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Check if admin - set isAdmin flag
        if (user.role === 'admin' || email === 'quocthanh2614@gmail.com') {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', 'admin');

            showToast('🎉 Đăng nhập thành công! Chào mừng Admin!', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', user.role || 'customer');

            showToast('Đăng nhập thành công!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    } else {
        showToast('Email hoặc mật khẩu không đúng!', 'error');
    }
}

// Handle register
function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (!name || !email || !phone || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Mật khẩu không khớp!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email exists
    if (users.find(u => u.email === email)) {
        showToast('Email đã được đăng ký!', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showToast('Đăng ký thành công!', 'success');

    // Auto login
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Show toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');

    toastMessage.textContent = message;

    if (type === 'success') {
        toast.className = 'toast success';
        toastIcon.className = 'fas fa-check-circle';
    } else {
        toast.className = 'toast error';
        toastIcon.className = 'fas fa-exclamation-circle';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
});

