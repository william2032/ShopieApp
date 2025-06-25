import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  totalStock: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopie_cart';
  private cartSubject = new BehaviorSubject<Cart>(this.loadCartFromStorage());

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  // Get cart observable
  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  // Get current cart value
  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  // Add item to cart
  addToCart(product: any): void {
    const currentCart = this.getCurrentCart();
    const existingItemIndex = currentCart.items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      const existingItem = currentCart.items[existingItemIndex];
      if (existingItem.quantity < product.totalStock) {
        currentCart.items[existingItemIndex].quantity += 1;
      } else {
        // Handle out of stock scenario
        console.warn('Product is out of stock');
        return;
      }
    } else {
      // New item, add to cart
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
  }

  // Remove item from cart
  removeFromCart(productId: string): void {
    const currentCart = this.getCurrentCart();
    currentCart.items = currentCart.items.filter(item => item.id !== productId);
    this.updateCart(currentCart);
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.getCurrentCart();
    const itemIndex = currentCart.items.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity <= currentCart.items[itemIndex].totalStock) {
        currentCart.items[itemIndex].quantity = quantity;
        this.updateCart(currentCart);
      }
    }
  }

  // Clear entire cart
  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
    this.updateCart(emptyCart);
  }

  // Get total items count
  getTotalItems(): number {
    return this.getCurrentCart().totalItems;
  }

  // Get total price
  getTotalPrice(): number {
    return this.getCurrentCart().totalPrice;
  }

  // Private method to update cart and recalculate totals
  private updateCart(cart: Cart): void {
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  // Load cart from localStorage
  private loadCartFromStorage(): Cart {
    try {
      const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return {
          items: parsedCart.items || [],
          totalItems: parsedCart.totalItems || 0,
          totalPrice: parsedCart.totalPrice || 0
        };
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }

    return {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }

  // Save cart to localStorage
  private saveCartToStorage(cart: Cart): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}
