import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() viewDetailsEvent = new EventEmitter<Product>();

  // Handle image loading errors
  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
  }

  // Add product to cart
  addToCart(): void {
    if (this.product.availableStock > 0) {
      this.addToCartEvent.emit(this.product);
    }
  }

  // View product details
  viewDetails(): void {
    this.viewDetailsEvent.emit(this.product);
  }

  // Get stock status text
  getStockStatusText(): string {
    if (this.product.availableStock === 0) {
      return 'Out of Stock';
    } else if (this.product.availableStock <= 5) {
      return `${this.product.availableStock} left`;
    } else if (this.product.availableStock <= 20) {
      return 'Limited Stock';
    } else {
      return 'In Stock';
    }
  }

  // Get stock status CSS class
  getStockStatusClass(): string {
    if (this.product.availableStock === 0) {
      return 'text-red-600 font-medium';
    } else if (this.product.availableStock <= 5) {
      return 'text-orange-600 font-medium';
    } else if (this.product.availableStock <= 20) {
      return 'text-yellow-600 font-medium';
    } else {
      return 'text-green-600 font-medium';
    }
  }

  // Get stock percentage for progress bar
  getStockPercentage(): number {
    if (this.product.totalStock === 0) return 0;
    return (this.product.availableStock / this.product.totalStock) * 100;
  }

  // Get stock progress bar CSS class
  getStockBarClass(): string {
    const percentage = this.getStockPercentage();
    if (percentage === 0) {
      return 'bg-red-500';
    } else if (percentage <= 25) {
      return 'bg-orange-500';
    } else if (percentage <= 50) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }
}
