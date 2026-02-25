import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Log critical errors for debugging
    console.error('Critical Application Error:', error);
  }
}
