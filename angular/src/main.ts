import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router'; // Thêm withHashLocation ở đây
import { AppComponent } from './app.component';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()) // Thêm withHashLocation() vào đây
  ]
}).catch((err) => console.error(err));