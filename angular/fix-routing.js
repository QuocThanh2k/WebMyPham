const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app');

// 1. Bản đồ các link cần thay thế (Bỏ đuôi .html và dùng đường dẫn định tuyến)
const linkMap = {
    'index.html': '/',
    'products.html': '/products',
    'cart.html': '/cart',
    'login.html': '/login',
    'contact.html': '/contact',
    'blog.html': '/blog',
    'brands.html': '/brands',
    'promotions.html': '/promotions',
    'profile.html': '/profile'
};

// Đệ quy tìm tất cả các file trong thư mục src/app
function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

console.log('--- BẮT ĐẦU CẤU HÌNH ROUTING TỰ ĐỘNG ---');



// B. Tự động Import RouterLink vào các file TS
if (filePath.endsWith('.component.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    if (content.includes('standalone: true') && !content.includes('RouterLink')) {
        content = `import { RouterLink } from '@angular/router';\n` + content;
        content = content.replace(/imports:\s*\[(.*?)\]/s, (match, p1) => {
            const imports = p1.trim() ? p1 + ', RouterLink' : 'RouterLink';
            return `imports: [${imports}]`;
        });
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Đã import RouterLink vào: ${path.basename(filePath)}`);
    }
}


// C. Dọn dẹp src/index.html (Xóa mã tĩnh thừa để nhường chỗ cho RouterOutlet)
const indexHtmlPath = path.join(__dirname, 'src', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    let content = fs.readFileSync(indexHtmlPath, 'utf8');
    const appRootMatch = content.indexOf('<app-root></app-root>');

    if (appRootMatch !== -1) {
        // Bổ sung thẻ <base href="/"> vào <head> nếu chưa có
        if (!content.includes('<base href="/">')) {
            content = content.replace('<head>', '<head>\n    <base href="/">');
        }

        // Chỉ giữ lại nội dung đến hết thẻ <app-root>
        const cleanContent = content.substring(0, appRootMatch + 21) + '\n</body>\n</html>';

        fs.writeFileSync(indexHtmlPath, cleanContent, 'utf8');
        console.log('✅ Đã dọn dẹp mã HTML tĩnh thừa và thêm thẻ base vào src/index.html');
    }
}

// D. Thiết lập <router-outlet> cho app.component.html
const appCompHtmlPath = path.join(srcDir, 'app.component.html');
if (fs.existsSync(appCompHtmlPath)) {
    fs.writeFileSync(appCompHtmlPath, '<router-outlet></router-outlet>\n', 'utf8');
    console.log('✅ Đã thiết lập <router-outlet> cho app.component.html');
}

// E. Import RouterOutlet vào app.component.ts
const appCompTsPath = path.join(srcDir, 'app.component.ts');
if (fs.existsSync(appCompTsPath)) {
    let content = fs.readFileSync(appCompTsPath, 'utf8');
    if (!content.includes('RouterOutlet')) {
        content = `import { RouterOutlet } from '@angular/router';\n` + content;
        content = content.replace(/imports:\s*\[(.*?)\]/s, (match, p1) => {
            const imports = p1.trim() ? p1 + ', RouterOutlet' : 'RouterOutlet';
            return `imports: [${imports}]`;
        });
        fs.writeFileSync(appCompTsPath, content, 'utf8');
    }
}

console.log('\n🎉 Hoàn tất! Cấu hình Angular Routing đã hoàn chỉnh.');