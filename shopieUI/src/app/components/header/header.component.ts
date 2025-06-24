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
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to currentUser$ to update login status
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user && authService.isLoggedIn();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home after logout
  }
}
