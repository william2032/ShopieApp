// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import {AuthService, User} from './auth.service';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  totalStock: number;
}

export interface Cart {
  id?: string; // Optional ID from the database
  userId?: string; // Associate with user
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  private errorSubject = new BehaviorSubject<string | null>(null);
  private readonly API_URL = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.loadCartFromDatabase(user.id);
      } else {
        this.cartSubject.next({ items: [], totalItems: 0, totalPrice: 0 }); // Clear local state on logout
      }
    });
  }

  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getError(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  addToCart(product: any): void {
    const currentCart = this.getCurrentCart();
    const existingItemIndex = currentCart.items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      const existingItem = currentCart.items[existingItemIndex];
      if (existingItem.quantity < product.totalStock) {
        currentCart.items[existingItemIndex].quantity += 1;
      } else {
        this.errorSubject.next(`Cannot add ${product.name}: Out of stock`);
        return;
      }
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        totalStock: product.totalStock
      };
      currentCart.items.push(newItem);
    }

    this.updateCart(currentCart);
    this.saveCartToDatabase();
  }

  removeFromCart(productId: string): void {
    const currentCart = this.getCurrentCart();
    currentCart.items = currentCart.items.filter(item => item.id !== productId);
    this.updateCart(currentCart);
    this.saveCartToDatabase();
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.getCurrentCart();
    const itemIndex = currentCart.items.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity <= currentCart.items[itemIndex].totalStock) {
        currentCart.items[itemIndex].quantity = quantity;
        this.updateCart(currentCart);
      } else {
        this.errorSubject.next(`Cannot set quantity: Exceeds stock for ${currentCart.items[itemIndex].name}`);
      }
    }
    this.saveCartToDatabase();
  }

  clearCart(): void {
    const emptyCart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
    this.updateCart(emptyCart);
    this.saveCartToDatabase();
  }

  getTotalItems(): number {
    return this.getCurrentCart().totalItems;
  }

  getTotalPrice(): number {
    return this.getCurrentCart().totalPrice;
  }

  private updateCart(cart: Cart): void {
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const user = this.authService.getCurrentUser();
    if (user) {
      cart.userId = user.id; // Associate with user
    }
    this.cartSubject.next(cart);
  }

  private loadCartFromDatabase(userId: string): void {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : this.authService.getHttpOptions().headers;
    this.http.get<Cart>(`${this.API_URL}/users/${userId}`, { headers }).pipe(
      tap(cart => {
        if (cart && Array.isArray(cart.items)) {
          this.cartSubject.next(cart);
        } else {
          this.cartSubject.next({ items: [], totalItems: 0, totalPrice: 0 });
        }
      }),
      catchError(error => {
        console.error('Error loading cart:', error);
        this.errorSubject.next('Failed to load cart');
        return of({ items: [], totalItems: 0, totalPrice: 0 });
      })
    ).subscribe();
  }

  private saveCartToDatabase(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      const cart = this.getCurrentCart();
      cart.userId = user.id;
      this.http.post<Cart>(this.API_URL, cart).pipe(
        tap(updatedCart => {
          if (updatedCart) {
            this.cartSubject.next(updatedCart);
          }
        }),
        catchError(error => {
          console.error('Error saving cart:', error);
          this.errorSubject.next('Failed to save cart');
          return of(cart);
        })
      ).subscribe();
    }
  }
}
