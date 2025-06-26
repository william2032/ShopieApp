import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

export interface Product {
  id?: string;
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
      map(response => {
        // Handle both array of arrays and simple array responses
        if (Array.isArray(response)) {
          return response as Product[];
        }
        return response.products?.[0] || response.products || [];
      }),
      tap(products => console.log('getProducts processed:', products)),
      catchError(this.handleError)
    );
  }

  getNewProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[][] }>(`${this.API_URL}/products`).pipe(
      map(response => {
        let products: Product[] = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          products = response as Product[];
        } else {
          products = response.products?.[0] || response.products || [];
        }

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
        let products: Product[] = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          products = response as Product[];
        } else {
          products = response.products?.[0] || response.products || [];
        }

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
    // Fixed: Removed double slash in URL
    return this.http.get<{ products: Product[][] }>(`${this.API_URL}/products/all`).pipe(
      map(response => {
        // Handle different response formats
        if (Array.isArray(response)) {
          return response as Product[];
        }
        return response.products?.[0] || response.products || [];
      }),
      tap(products => console.log('getAllProducts processed:', products)),
      catchError(this.handleError)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`).pipe(
      tap(product => console.log('getProductById response:', product)),
      catchError(this.handleError)
    );
  }

  createProduct(product: Product): Observable<Product> {
    const token = this.authService.getToken();
    const headers = token ? {Authorization: `Bearer ${token}`} : this.authService.getHttpOptions().headers;

    // Set default values
    product.adminId = this.authService.getCurrentUser()?.id || '';
    product.createdAt = new Date().toISOString();
    product.updatedAt = new Date().toISOString();
    product.availableStock = product.totalStock;
    product.reservedStock = 0;

    return this.http.post<Product>(`${this.API_URL}/products`, product, {headers}).pipe(
      tap(response => console.log('createProduct response:', response)),
      catchError((error) => this.handleError(error))
    );
  }

  deleteProduct(id: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = token ? {Authorization: `Bearer ${token}`} : this.authService.getHttpOptions().headers;

    return this.http.delete<void>(`${this.API_URL}/products/${id}`, {headers}).pipe(
      tap(() => console.log('deleteProduct successful for id:', id)),
      catchError((error) => this.handleError(error))
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    const token = this.authService.getToken();
    const headers = token ? {Authorization: `Bearer ${token}`} : this.authService.getHttpOptions().headers;

    product.updatedAt = new Date().toISOString();

    return this.http.patch<Product>(`${this.API_URL}/products/${id}`, product, {headers}).pipe(
      tap(response => console.log('updateProduct response:', response)),
      catchError((error) => this.handleError(error))
    );
  }

  // Additional helper methods for better error handling and debugging

  testConnection(): Observable<any> {
    return this.http.get(`${this.API_URL}/health`).pipe(
      tap(response => console.log('Health check response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    console.error('API error details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error
    });

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
          break;
        case 404:
          errorMessage = `Endpoint not found: ${error.url}. Please check your API configuration.`;
          break;
        case 401:
          errorMessage = 'Unauthorized. Please check your authentication.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Server Error ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
