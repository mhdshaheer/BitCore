import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, AuthResponse, User, RegisterRequest, LoginRequest } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _cookieService = inject(CookieService);
  private _http = inject(HttpClient);
  private _router = inject(Router);
  
  private readonly _apiUrl = `${environment.apiUrl}/auth`;
  currentUser = signal<User | null>(this.getUserFromStorage());

  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${this._apiUrl}/register`, data);
  }

  verify(token: string): Observable<ApiResponse<void>> {
    return this._http.post<ApiResponse<void>>(`${this._apiUrl}/verify`, { token });
  }

  resendVerification(email: string): Observable<ApiResponse<void>> {
    return this._http.post<ApiResponse<void>>(`${this._apiUrl}/resend-verification`, { email });
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this._http.post<ApiResponse<AuthResponse>>(`${this._apiUrl}/login`, data).pipe(
      tap(res => {
        if (res.success) {
          this._setTokens(res.data.accessToken, res.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          this.currentUser.set(res.data.user);
        }
      })
    );
  }

  logout() {
    this._cookieService.delete('token', '/');
    this._cookieService.delete('refreshToken', '/');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this._router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._cookieService.get('token') || null;
  }

  getRefreshToken(): string | null {
    return this._cookieService.get('refreshToken') || null;
  }

  refreshTokens(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this._http.post<ApiResponse<AuthResponse>>(`${this._apiUrl}/refresh`, { refreshToken }).pipe(
      tap(res => {
        if (res.success) {
          this._setTokens(res.data.accessToken, res.data.refreshToken);
        }
      })
    );
  }

  private _setTokens(accessToken: string, refreshToken: string) {
    // Access token - 15m (Server expiry)
    this._cookieService.set('token', accessToken, 7, '/', '', true, 'Strict');
    // Refresh token - 7d (Server expiry)
    this._cookieService.set('refreshToken', refreshToken, 7, '/', '', true, 'Strict');
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
