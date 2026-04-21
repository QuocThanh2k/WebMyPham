// Coupon utility functions for admin.html

// Populate coupon form from coupon object
function populateCouponForm(coupon) {
    document.getElementById('couponId').value = coupon.id || '';
    document.getElementById('couponCode').value = coupon.code || '';
    document.getElementById('couponType').value = coupon.discountType || '';
    document.getElementById('couponValue').value = coupon.value || '';
    document.getElementById('couponMinOrder').value = coupon.minOrder || '';
    document.getElementById('couponUsageLimit').value = coupon.usageLimit || '';
    document.getElementById('couponStatus').value = coupon.status || 'active';
    document.getElementById('couponNotes').value = coupon.notes || '';
    toggleDiscountInput(); // Update placeholder
}

// Reset coupon form to new state
function resetCouponForm() {
    const form = document.getElementById('couponForm');
    if (form) form.reset();
    document.getElementById('couponId').value = '';
    document.getElementById('couponStatus').value = 'active';
    const fields = ['couponCode', 'couponType', 'couponValue', 'couponMinOrder', 'couponUsageLimit', 'couponStatus', 'couponNotes'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = false;
    });
    const saveBtn = document.querySelector('#couponModal .modal-footer .btn-primary');
    if (saveBtn) saveBtn.style.display = 'block';
    document.getElementById('couponModalTitle').textContent = 'Thêm Mã Giảm Giá Mới';
}

// Toggle discount input placeholder
function toggleDiscountInput() {
    const type = document.getElementById('couponType').value;
    const valueInput = document.getElementById('couponValue');
    const placeholder = type === 'percent' ? 'VD: 20 (%)' : 'VD: 50000 (VNĐ)';
    if (valueInput) valueInput.placeholder = placeholder;
}

// Close coupon modal with reset
function closeCouponModal() {
    resetCouponForm();
    const modal = document.getElementById('couponModal');
    if (modal) modal.classList.remove('active');
}

// Delete coupon
function deleteCoupon(id) {
    if (confirm('Xóa mã giảm giá này?')) {
        let coupons = COUPON_SYSTEM.getCoupons();
        coupons = coupons.filter(c => c.id !== id);
        COUPON_SYSTEM.saveCoupons(coupons);
        COUPON_SYSTEM.render();
        if (typeof showToast === 'function') showToast('Đã xóa mã giảm giá!', 'success');
    }
}

// View coupon (modal readonly)
function viewCoupon(code) {
    let coupons = JSON.parse(localStorage.getItem('adminCoupons') || '[]');
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
        if (typeof showToast === 'function') showToast('Không tìm thấy mã!', 'error');
        return;
    }

    populateCouponForm(coupon);
    const fields = ['couponCode', 'couponType', 'couponValue', 'couponMinOrder', 'couponUsageLimit', 'couponStatus', 'couponNotes'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = true;
    });
    document.querySelector('#couponModal .btn-primary').style.display = 'none';
    document.getElementById('couponModalTitle').textContent = `Chi tiết: ${code}`;
    document.getElementById('couponModal').classList.add('active');
}

// Edit coupon (modal editable)
function editCoupon(id) {
    let coupons = JSON.parse(localStorage.getItem('adminCoupons') || '[]');
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) {
        if (typeof showToast === 'function') showToast('Không tìm thấy mã!', 'error');
        return;
    }

    populateCouponForm(coupon);
    const fields = ['couponCode', 'couponType', 'couponValue', 'couponMinOrder', 'couponUsageLimit', 'couponStatus', 'couponNotes'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = false;
    });
    document.querySelector('#couponModal .btn-primary').style.display = 'block';
    document.getElementById('couponModalTitle').textContent = 'Sửa Mã Giảm Giá';
    document.getElementById('couponModal').classList.add('active');
}

