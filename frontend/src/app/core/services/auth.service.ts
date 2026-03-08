import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, AuthResponse, User, RegisterRequest, LoginRequest } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { API_ROUTES, APP_ROUTES } from '../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _cookieService = inject(CookieService);
  private _http = inject(HttpClient);
  private _router = inject(Router);
  
  private readonly _apiUrl = `${environment.apiUrl}/${API_ROUTES.AUTH.PREFIX}`;
  currentUser = signal<User | null>(this.getUserFromStorage());

  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${this._apiUrl}/${API_ROUTES.AUTH.REGISTER}`, data);
  }

  verify(token: string, context?: HttpContext): Observable<ApiResponse<void>> {
    return this._http.post<ApiResponse<void>>(`${this._apiUrl}/${API_ROUTES.AUTH.VERIFY}`, { token }, { context });
  }

  resendVerification(email: string): Observable<ApiResponse<void>> {
    return this._http.post<ApiResponse<void>>(`${this._apiUrl}/${API_ROUTES.AUTH.RESEND_VERIFICATION}`, { email });
  }

  login(data: LoginRequest, context?: HttpContext): Observable<ApiResponse<AuthResponse>> {
    return this._http.post<ApiResponse<AuthResponse>>(`${this._apiUrl}/${API_ROUTES.AUTH.LOGIN}`, data, { context }).pipe(
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
    this._router.navigate([`/${APP_ROUTES.AUTH.LOGIN}`]);
  }

  getToken(): string | null {
    return this._cookieService.get('token') || null;
  }

  getRefreshToken(): string | null {
    return this._cookieService.get('refreshToken') || null;
  }

  refreshTokens(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this._http.post<ApiResponse<AuthResponse>>(`${this._apiUrl}/${API_ROUTES.AUTH.REFRESH}`, { refreshToken }).pipe(
      tap(res => {
        if (res.success) {
          this._setTokens(res.data.accessToken, res.data.refreshToken);
        }
      })
    );
  }

  private _setTokens(accessToken: string, refreshToken: string) {
    this._cookieService.set('token', accessToken, 7, '/', '', true, 'Strict');
    this._cookieService.set('refreshToken', refreshToken, 7, '/', '', true, 'Strict');
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
