import { Routes } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { ProductsComponent } from './app/products/products.component';
import { CartComponent } from './app/cart/cart.component';
import { LoginComponent } from './app/login/login.component';
import { ContactComponent } from './app/contact/contact.component';
import { BlogComponent } from './app/blog/blog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },           // Trang chủ
  { path: 'products', component: ProductsComponent }, // Trang sản phẩm
  { path: 'cart', component: CartComponent },         // Giỏ hàng
  { path: 'login', component: LoginComponent },       // Đăng nhập
  { path: 'contact', component: ContactComponent },   // Liên hệ
  { path: 'blog', component: BlogComponent },         // Blog
  // Mở comment nếu bạn đã tạo Component tương ứng
  // { path: 'brands', component: BrandsComponent },
  // { path: 'promotions', component: PromotionsComponent },
  { path: '**', redirectTo: '' }                      // Nếu gõ bậy thì về trang chủ
];
