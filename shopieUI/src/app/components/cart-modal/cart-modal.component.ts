import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService, Cart, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() checkoutClick = new EventEmitter<void>();

  cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCart().subscribe(
      cart => {
        this.cart = cart;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  closeCart(): void {
    this.closeModal.emit();
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.id, newQuantity);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    this.checkoutClick.emit();
    this.closeCart();
  }

  // Handle backdrop click
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeCart();
    }
  }

  // Calculate item total
  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }
}
