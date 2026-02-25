import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private _toastService = inject(ToastService);

  handleError(error: any): void {
    // Log for developers
    console.error('Critical Application Error:', error);
    
    // Show a user-friendly toast for unexpected crashes
    this._toastService.show('A critical error occurred. Please refresh the page.', 'error');
  }
}
