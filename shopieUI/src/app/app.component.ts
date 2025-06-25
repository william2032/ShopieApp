import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductSectionComponent } from './components/product-section/product-section.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeroBannersComponent } from './components/hero-banners/hero-banners.component';
import { HotDealComponent } from './components/hot-deal/hot-deal.component';
import { TopSellingGridComponent } from './components/top-selling-grid/top-selling-grid.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductService, Product } from './services/product.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface Category {
  name: string;
  slug: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ProductSectionComponent,
    HeaderComponent,
    NavigationComponent,
    HeroBannersComponent,
    HotDealComponent,
    TopSellingGridComponent,
    NewsletterComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  newProducts: Product[] = [];
  topSellingProducts: Product[] = [];
  productCategories: Category[] = [
    { name: 'All', slug: 'all' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Cameras', slug: 'cameras' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Tablets', slug: 'tablets' }
  ];
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.productService.getNewProducts().pipe(
      tap(products => {
        this.newProducts = products;
        this.isLoading = false;
      }),
      catchError(error => {
        this.handleError(error);
        return of([]);
      })
    ).subscribe();

    this.productService.getTopSellingProducts().pipe(
      tap(products => {
        this.topSellingProducts = products;
        this.isLoading = false;
      }),
      catchError(error => {
        this.handleError(error);
        return of([]);
      })
    ).subscribe();
  }

  retryLoadData(): void {
    this.loadProducts();
  }

  private handleError(error: any): void {
    this.hasError = true;
    this.errorMessage = 'Failed to load products. Please try again later.';
    this.isLoading = false;
    console.error('Error loading products:', error);
  }
}
