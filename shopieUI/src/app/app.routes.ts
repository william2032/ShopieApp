import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  // { path: '', component: AppComponent }, // Home page
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'forgot-password', component: AuthComponent, data: { mode: 'forgot-password' } },
  { path: 'reset-password', component: AuthComponent, data: { mode: 'reset-password' } },
  { path: '**', redirectTo: '' } // Wildcard route for 404
];
