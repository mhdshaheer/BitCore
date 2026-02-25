import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const router = this.injector.get(Router);
    
    // Log the error for developers
    console.error('Critical Application Error:', error);

    // We can filter out certain errors or redirect for all major crashes
    // For now, we'll just log to console. 
    // If you want to force redirect on ALL JS crashes:
    // router.navigate(['/error/500']);
  }
}
