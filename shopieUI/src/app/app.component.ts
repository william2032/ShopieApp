import { Component, OnInit } from '@angular/core';
import { Product, Category } from './interfaces/product.interface';
import { DataService } from './services/data.service';
import {HeaderComponent} from './components/header/header.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {HeroBannersComponent} from './components/hero-banners/hero-banners.component';
import {ProductSectionComponent} from './components/product-section/product-section.component';
import {HotDealComponent} from './components/hot-deal/hot-deal.component';
import {TopSellingGridComponent} from './components/top-selling-grid/top-selling-grid.component';
import {NewsletterComponent} from './components/newsletter/newsletter.component';
import {FooterComponent} from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    NavigationComponent,
    HeroBannersComponent,
    ProductSectionComponent,
    HotDealComponent,
    TopSellingGridComponent,
    NewsletterComponent,
    FooterComponent
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Shopie';

  // Data properties for template binding
  newProducts: Product[] = [];
  topSellingProducts: Product[] = [];
  productCategories: Category[] = [];

  // Loading state
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAppData();
  }

  /**
   * Load all required data for the application
   */
  private loadAppData(): void {
    try {
      this.isLoading = true;
      this.hasError = false;

      // Load new products
      this.newProducts = this.dataService.getNewProducts();

      // Load top selling products
      this.topSellingProducts = this.dataService.getTopSellingProducts();

      // Load categories with 'All' option
      this.productCategories = [
        { name: 'All', slug: 'all' },
        ...this.dataService.getCategories()
      ];

      this.isLoading = false;

      // Log loaded data for debugging
      console.log('New Products:', this.newProducts.length);
      console.log('Top Selling Products:', this.topSellingProducts.length);
      console.log('Categories:', this.productCategories.length);

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle loading errors
   */
  private handleError(error: any): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = 'Failed to load store data. Please try again later.';
    console.error('Error loading app data:', error);
  }

  /**
   * Retry loading data
   */
  retryLoadData(): void {
    this.loadAppData();
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  /**
   * Track by function for categories
   */
  trackByCategorySlug(index: number, category: Category): string {
    return category.slug;
  }
}
