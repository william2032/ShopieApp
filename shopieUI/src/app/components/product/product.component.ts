import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  // Filter properties
  selectedCategory = 'All';
  categories = ['All', 'Laptops', 'Smartphones', 'Cameras', 'Accessories', 'Tablets'];
  sortBy = 'name';

  private productSubscription?: Subscription;

  constructor(private productService: ProductService) {
    // Debug: Check if service is injected
    console.log('ProductService injected:', this.productService);
  }

  ngOnInit(): void {
    console.log('ProductsComponent initialized');
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    console.log('Loading products...');
    this.loading = true;
    this.error = null;

    this.productSubscription = this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products received from service:', products);
        console.log('Number of products:', products?.length || 0);

        this.products = products || [];
        this.filteredProducts = [...this.products];
        this.updateCategories();
        this.loading = false;

        console.log('Products array:', this.products);
        console.log('Filtered products array:', this.filteredProducts);
        console.log('Loading state:', this.loading);
        console.log('Error state:', this.error);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Update categories based on loaded products
  private updateCategories(): void {
    console.log('Updating categories...');
    const uniqueCategories = new Set(
      this.products
        .map(p => p.category)
        .filter(category => category && category.trim() !== '')
    );

    // @ts-ignore
    this.categories = ['All', ...Array.from(uniqueCategories)];
    console.log('Updated categories:', this.categories);
  }

  // Filter products by category
  filterByCategory(category: string): void {
    console.log('Filtering by category:', category);
    this.selectedCategory = category;
    this.applyFilters();
  }

  // Sort products
  sortProducts(sortBy: string): void {
    console.log('Sorting by:', sortBy);
    this.sortBy = sortBy;
    this.applyFilters();
  }

  // Apply all filters and sorting
  private applyFilters(): void {
    console.log('Applying filters - Category:', this.selectedCategory, 'Sort:', this.sortBy);
    let filtered = [...this.products];

    // Apply category filter
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    this.filteredProducts = filtered;
    console.log('Filtered products result:', this.filteredProducts);
    console.log('Filtered products length:', this.filteredProducts.length);
  }

  // Refresh products
  refreshProducts(): void {
    console.log('Refreshing products...');
    this.loadProducts();
  }

  // Track function for ngFor performance
  trackByProductId(index: number, product: Product): string {
    return product.adminId;
  }

  // Handle add to cart event from product card
  onAddToCart(product: Product): void {
    console.log('Adding to cart:', product);
  }

  // Handle view details event from product card
  onViewDetails(product: Product): void {
    console.log('Viewing details for:', product);
  }

  // Debug method to check component state
  logComponentState(): void {
    console.log('=== COMPONENT STATE ===');
    console.log('Loading:', this.loading);
    console.log('Error:', this.error);
    console.log('Products length:', this.products.length);
    console.log('Filtered products length:', this.filteredProducts.length);
    console.log('Selected category:', this.selectedCategory);
    console.log('Products:', this.products);
    console.log('Filtered products:', this.filteredProducts);
    console.log('=======================');
  }
}
