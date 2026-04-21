// Đồng bộ số lượng giỏ hàng
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
});

// Xử lý form liên hệ
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\\s@]+@[ ^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Email không hợp lệ!', 'error');
        return;
    }

    // Lưu vào localStorage (simulate gửi tin nhắn)
    const contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const newMessage = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        date: new Date().toISOString(),
        status: 'new'
    };
    contactMessages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(contactMessages));

    // Hiển thị thông báo thành công
    showToast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');

    // Reset form
    this.reset();
});

// Hàm hiển thị toast notification
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

    // Ẩn toast sau 4 giây
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
