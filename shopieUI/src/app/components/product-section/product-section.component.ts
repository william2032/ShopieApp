import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import {Product} from '../../services/product.service';

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
  loading = false; // Set to false since products are passed via input
  error: string | null = null;

  ngOnChanges(): void {
    // Ensure products is an array before spreading
    this.filteredProducts = Array.isArray(this.products) ? [...this.products] : [];
    this.selectCategory(this.selectedCategory);
  }

  selectCategory(slug: string): void {
    this.selectedCategory = slug;
    // Ensure products is an array before filtering
    this.filteredProducts = Array.isArray(this.products)
      ? this.products.filter(product =>
        slug === 'all' || product.category?.toLowerCase() === slug.toLowerCase()
      )
      : [];
  }

  onAddToCart(product: Product): void {
    console.log(`Added ${product.name} to cart`);
    // Implement cart logic, e.g., call a CartService
  }

  onViewDetails(product: Product): void {
    console.log(`Viewing details for ${product.name}`);
    // Implement navigation, e.g., using Angular Router
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
