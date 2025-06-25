import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cart, CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {CartModalComponent} from '../cart-modal/cart-modal.component';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-header',
  imports: [NgIf, CartModalComponent, NgClass, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userEmail: string | null = null;
  isLoggedIn: boolean = false;
  cart: Cart = {items: [], totalItems: 0, totalPrice: 0};
  isCartOpen: boolean = false;
  searchTerm: string = '';
  sortBy: string = 'name';
  viewMode: 'grid' | 'list' = 'grid'
  filteredProducts: any[] = [];
  products: any[] = [];

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

  onSearch(): void {
    this.filterProducts();
  }

  onSort(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        this.filteredProducts.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
        break;
      case 'price-high':
        this.filteredProducts.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
        break;
      case 'newest':
        this.filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchLower))
      );
    }
    this.onSort();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterProducts();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'name';
    this.filterProducts();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  trackByProduct(index: number, product: any): any {
    return product.id;
  }

  isNewProduct(product: any): boolean {
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    return diffDays < 7;
  }

  getDescriptionPreview(description: string): string {
    if (!description) return '';
    return description.length > 80
      ? description.slice(0, 80) + '...'
      : description;
  }



}
