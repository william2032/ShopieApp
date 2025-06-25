import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cart, CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgClass, NgIf} from '@angular/common';
import {CartModalComponent} from '../cart-modal/cart-modal.component';


@Component({
  selector: 'app-header',
  imports: [NgIf, CartModalComponent, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userEmail: string | null = null;
  isLoggedIn: boolean = false;
  cart: Cart = {items: [], totalItems: 0, totalPrice: 0};
  isCartOpen: boolean = false;

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
      this.authService.logout();
      this.router.navigate(['/']);
  }

  openCart(): void {
    this.isCartOpen = true; // Toggle modal open
  }
  closeCart(): void {
    this.isCartOpen = false;
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log('Searching for:', searchTerm);
  }
}
