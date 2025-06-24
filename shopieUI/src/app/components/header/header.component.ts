import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userEmail: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to currentUser$ to update login status
    this.authService.currentUser$.subscribe(user => {
      this.userEmail = user?.email || null;
      this.isLoggedIn = !!user && authService.isLoggedIn();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/']); // Redirect to home after logout
    }, 2000);
  }
}
