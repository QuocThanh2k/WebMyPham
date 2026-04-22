const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app');
const componentsToFix = [
    'products/products.component.html',
    'login/login.component.html',
    'contact/contact.component.html',
    'cart/cart.component.html',
    'blog/blog.component.html',
    'home/home.component.html',
];

console.log('--- Bắt đầu dọn dẹp file HTML cho Angular ---');

// 1. Dọn dẹp các file HTML của component
componentsToFix.forEach(componentPath => {
    const fullPath = path.join(srcDir, componentPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;

        // Xóa các thẻ không hợp lệ: <!DOCTYPE>, <html>, <head>, <body>, <script>
        content = content.replace(/<!DOCTYPE html>/gi, '');
        content = content.replace(/<html[^>]*>/gi, '');
        content = content.replace(/<\/html>/gi, '');
        content = content.replace(/<head>[\s\S]*?<\/head>/gi, '');
        content = content.replace(/<body[^>]*>/gi, '');
        content = content.replace(/<\/body>/gi, '');
        content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

        // Sửa lỗi @gmail trong file products
        if (componentPath.includes('products')) {
            content = content.replace(/quocthanh2614@gmail\.com/g, 'quocthanh2614&#64;gmail.com');
        }

        content = content.trim();

        if (content !== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ Đã dọn dẹp: ${componentPath}`);
        }
    }
});

// 2. Sửa các file CSS rỗng
const cssDirs = [
    path.join(srcDir, 'blog', 'css'),
    path.join(srcDir, 'cart', 'css'),
    path.join(srcDir, 'login', 'css'),
    path.join(srcDir, 'products', 'css'),
    path.join(srcDir, 'contact', 'css'),
];

console.log('\n--- Kiểm tra các file CSS rỗng ---');

cssDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.endsWith('.css')) {
                const filePath = path.join(dir, file);
                let content = fs.readFileSync(filePath, 'utf8');
                if (content.length === 0 || content.includes('webpackBootstrap') || content.includes('(() => {')) {
                    fs.writeFileSync(filePath, '/* Fixed empty CSS file */\n', 'utf8');
                    console.log(`✅ Đã dọn dẹp file CSS lỗi: ${path.relative(__dirname, filePath)}`);
                }
            }
        });
    }
});

const stylesCssPath = path.join(__dirname, 'src', 'styles.css');
if (!fs.existsSync(stylesCssPath)) {
    fs.writeFileSync(stylesCssPath, '/* Global Styles */\n', 'utf8');
    console.log('✅ Đã tạo file src/styles.css bị thiếu');
}

['cart', 'blog', 'products', 'login', 'contact', 'home'].forEach(comp => {
    const cssDir = path.join(srcDir, comp, 'css');
    if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

    ['header.css', 'home.css', 'main.css', 'responsive.css', 'cart.css', 'home-new.css'].forEach(cssFile => {
        const filePath = path.join(cssDir, cssFile);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '/* Auto generated CSS */\n', 'utf8');
        }
    });
});

console.log('\n🎉 Hoàn tất! Vui lòng chạy lại `npm run build` hoặc `ng serve`.');
