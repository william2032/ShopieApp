import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import {Subscription} from 'rxjs'; // Import CartService

interface Category {
  name: string;
  slug: string;
}

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSectionComponent {
  @Input() title = 'Our Products';
  @Input() products: Product[] = [];
  @Input() categories: Category[] = [
    { name: 'All', slug: 'all' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Cameras', slug: 'cameras' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Tablets', slug: 'tablets' }
  ];

  filteredProducts: Product[] = [];
  selectedCategory = 'all';
  loading = false;
  error: string | null = null;
  cartError: string | null = null;
  private cartErrorSub!: Subscription;

  constructor(private cdr: ChangeDetectorRef, private cartService: CartService) {}
  ngOnInit(): void {
    this.cartErrorSub = this.cartService.getError().subscribe(error => {
      this.cartError = error;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.cartErrorSub.unsubscribe();
  }
  ngOnChanges(): void {
    console.log('ProductSectionComponent products input:', this.products);
    this.filteredProducts = Array.isArray(this.products) ? [...this.products] : [];
    this.selectCategory(this.selectedCategory);
    this.cdr.markForCheck();
  }

  selectCategory(slug: string): void {
    this.selectedCategory = slug;
    this.filteredProducts = Array.isArray(this.products)
      ? this.products.filter(product =>
        slug === 'all' || product.category?.toLowerCase() === slug.toLowerCase()
      )
      : [];
    console.log('Filtered products:', this.filteredProducts);
    this.cdr.markForCheck();
  }

  onAddToCart(product: Product): void {
    console.log(`Adding ${product.name} to cart`);
    this.cartService.addToCart(product); // Call CartService
  }

  onViewDetails(product: Product): void {
    console.log(`Viewing details for ${product.name}`);
    // Implement navigation, e.g., using Angular Router
  }

  trackByProductId(index: number, product: Product): string {
    return product.adminId;
  }
}
