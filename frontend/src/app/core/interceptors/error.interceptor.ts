import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized is handled by auth logic usually, but we check here too
      if (error.status === 401) {
        toastService.show('Session expired. Please login again.', 'error');
        router.navigate(['/auth/login']);
      } 
      // 404 handled by routing for pages, but for API 404 we might want to show toast
      else if (error.status === 404) {
        // Specific API 404s can be handled by the component, or we show a generic toast
        // We link into the 404 page if it's a critical missing resource
        console.error('API Resource not found:', error.url);
      }
      // 500+ Server Errors
      else if (error.status >= 500) {
        router.navigate(['/500']);
      }
      // Network failures (status 0)
      else if (error.status === 0) {
        router.navigate(['/500'], { queryParams: { type: 'offline' } });
      }

      return throwError(() => error);
    })
  );
};
