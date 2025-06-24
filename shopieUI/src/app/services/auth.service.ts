import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';

// Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL =  environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.loadUserFromStorage();
  }

  // Login method
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials, this.httpOptions)
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        catchError(this.handleError)
      );
  }

  // Register method
  register(userData: RegisterRequest): Observable<AuthResponse> {
    const fixedUserData = {
      ...userData,
      role: userData.role?.toUpperCase() || 'CUSTOMER' // default to CUSTOMER if undefined
    };
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, fixedUserData, this.httpOptions)
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        catchError(this.handleError)
      );
  }

  // Forgot password method
  forgotPassword(data: ForgotPasswordRequest): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/forgot-password`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Reset password method
  resetPassword(data: ResetPasswordRequest): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/reset-password`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires_at');
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    const now = new Date().getTime();
    const expiration = parseInt(expiresAt);

    if (now >= expiration) {
      this.logout();
      return false;
    }

    return true;
  }

  // Get authorization token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Private methods
  private setSession(authResult: AuthResponse): void {
    const expiresAt = new Date().getTime() + (authResult.expires_in * 1000);

    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('token_expires_at', expiresAt.toString());

    this.currentUserSubject.next(authResult.user);
  }

  private loadUserFromStorage(): void {
    if (this.isLoggedIn()) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      }
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
