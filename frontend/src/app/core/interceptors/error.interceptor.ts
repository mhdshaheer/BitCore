import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { SKIP_ERROR_TOAST } from '../utils/http-context';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 is handled by auth.interceptor (refresh logic)
      if (error.status === 401) {
        return throwError(() => error);
      }

      const skipToast = req.context.get(SKIP_ERROR_TOAST);
      const errorMessage = error.error?.message || 'An unexpected error occurred';

      if (error.status === 404) {
        if (req.url.includes('/api/')) {
          if (!skipToast) toastService.show(errorMessage, 'error');
        }
      }
      else if (error.status >= 500) {
        router.navigate(['/500']);
      }
      else if (error.status === 0) {
        router.navigate(['/500'], { queryParams: { type: 'offline' } });
      }
      else if (error.status >= 400 && error.status < 500) {
        if (!skipToast) toastService.show(errorMessage, 'error');
      }

      return throwError(() => error);
    })
  );
};
