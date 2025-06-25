// src/app/services/product.service.ts
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  category?: string;
  rating?: number;
  originalPrice?: number;
  isNew?: boolean;
  isHot?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[][] }>(`${this.API_URL}/products`).pipe(
      map(response => response.products[0] || []),
      tap(products => console.log('getProducts processed:', products)),
      catchError(this.handleError)
    );
  }

  getNewProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[][] }>(`${this.API_URL}/products`).pipe(
      map(response => {
        const products = response.products[0] || [];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return products
          .map(product => ({
            ...product,
            isNew: new Date(product.createdAt) > sevenDaysAgo,
            category: product.category || 'laptops' // Default category
          }))
          .filter(product => product.isNew);
      }),
      tap(products => console.log('getNewProducts processed:', products)),
      catchError(this.handleError)
    );
  }

  getTopSellingProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[][] }>(`${this.API_URL}/products`).pipe(
      map(response => {
        const products = response.products[0] || [];
        return products
          .map(product => ({
            ...product,
            isHot: true, // Assume all are hot for now
            category: product.category || 'laptops'
          }))
          .slice(0, 4); // Limit to 4 products
      }),
      tap(products => console.log('getTopSellingProducts processed:', products)),
      catchError(this.handleError)
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[][] }>(`${this.API_URL}/all`).pipe(
      map(response => response.products[0] || []),
      tap(products => console.log('getAllProducts processed:', products)),
      catchError(this.handleError)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
      tap(product => console.log('getProductById response:', product)),
      catchError(this.handleError)
    );
  }


  createProduct(product: Product): Observable<Product> {
    const token = this.authService.getToken();
    const headers = token ? {Authorization: `Bearer ${token}`} : this.authService.getHttpOptions().headers;
    product.adminId = this.authService.getCurrentUser()?.id || '';
    product.createdAt = new Date().toISOString();
    product.updatedAt = new Date().toISOString();
    product.availableStock = product.totalStock;
    product.reservedStock = 0;
    return this.http.post<Product>(this.API_URL, product, {headers}).pipe(
      catchError((error) => this.handleError(error))    );
  }

  deleteProduct(id: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = token ? {Authorization: `Bearer ${token}`} : this.authService.getHttpOptions().headers;
    return this.http.delete<void>(`${this.API_URL}/${id}`, {headers}).pipe(
      catchError((error) => this.handleError(error)));
  }

  // Add editProduct method if needed
  updateProduct(id: string, product: Product): Observable<Product> {
    const token = this.authService.getToken();
    const headers = token ? {Authorization: `Bearer ${token}`} : this.authService.getHttpOptions().headers;
    product.updatedAt = new Date().toISOString();
    return this.http.put<Product>(`${this.API_URL}/${id}`, product, {headers}).pipe(
      catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    console.error('API error:', error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
