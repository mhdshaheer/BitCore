import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError, switchMap, BehaviorSubject, filter, take, EMPTY } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const refreshToken = authService.getRefreshToken();

  if (!token && refreshToken && !isAuthRoute(req.url)) {
    return handle401Error(req, next, authService);
  }

  if (token) {
    req = addTokenHeader(req, token);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized (except for login/register/refresh endpoints)
      if (error.status === 401 && !isAuthRoute(req.url)) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

const isAuthRoute = (url: string): boolean => {
  return url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register');
};

const addTokenHeader = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshTokens().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next(res.data.accessToken);
        // Retry the original request with the new access token
        return next(addTokenHeader(request, res.data.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        // If refreshing fails, the session is truly dead. Logout the user.
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // If a refresh is already in progress, wait for it to finish and then use the new token
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addTokenHeader(request, token!)))
    );
  }
};
