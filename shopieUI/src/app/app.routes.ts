import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AppComponent } from './app.component';
import {ProductsComponent} from './components/product/product.component';

export const routes: Routes = [
  // { path: '', component: AppComponent }, // Home page
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'products', component: ProductsComponent },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'forgot-password', component: AuthComponent, data: { mode: 'forgot-password' } },
  { path: 'reset-password', component: AuthComponent, data: { mode: 'reset-password' } },
  { path: '**', redirectTo: '' } // Wildcard route for 404
];
