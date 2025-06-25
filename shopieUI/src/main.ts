import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './app/services/auth.service';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {ProductService} from './app/services/product.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
   ProductService,
    AuthService
  ]
}).catch(err => console.error(err));
