import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cart, CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userEmail: string | null = null;
  isLoggedIn: boolean = false;
  cart: Cart = {items: [], totalItems: 0, totalPrice: 0};

  private cartSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.userEmail = user?.email || null;
      this.isLoggedIn = !!user && this.authService.isLoggedIn();
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  openWishlist(): void {
    // Navigate to wishlist page
    this.router.navigate(['/wishlist']);
  }

  logout(): void {
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/']); // Redirect to home after logout
    }, 2000);
  }

  openCart(): void {
    // Navigate to cart page or open cart modal
    this.router.navigate(['/cart']);
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  }
}
