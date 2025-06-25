import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard.component';
import {AdminGuard} from '../../services/auth-guard.service';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent, canActivate: [AdminGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminDashboardComponent
  ]
})
export class AdminModule { }
