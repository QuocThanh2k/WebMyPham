// 🔧 API & Asset Config - Cosmetics Website Thanh Tâm
// Edit these URLs for your environment

window.API_BASE_URL = 'http://localhost/api/';  // XAMPP Apache:80 → PHP APIs
// window.API_BASE_URL = './api/';             // PROD: Same-origin Apache

window.IMG_BASE_URL = '';  // Relative: works cross-port for static images
// window.IMG_BASE_URL = './images/';         // PROD: Explicit relative

window.DB_FALLBACK = true;  // Use data.js productsData if API fails

// Auto-detect mode (optional)
if (window.location.port === '5500') {
    console.log('🌐 DEV MODE: Live Server (5500) + XAMPP APIs');
} else {
    console.log('🚀 PROD MODE: Apache serving all');
}

// Export for main.js/data.js
console.log(`📡 API: ${window.API_BASE_URL} | Images: ${window.IMG_BASE_URL}`);

