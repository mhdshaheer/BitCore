import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormWrapperComponent } from '../../../shared/components/form-wrapper/form-wrapper.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink, FormWrapperComponent, LoadingSpinnerComponent],
  template: `
    <app-form-wrapper [description]="statusMessage()">
      <div class="flex flex-col items-center py-6 text-center">
        <div *ngIf="status() === 'loading'" class="py-8">
          <app-loading-spinner size="lg" message="Validating verification token..."></app-loading-spinner>
        </div>

        <div *ngIf="status() === 'success'" class="space-y-6">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-slate-600">Your email has been successfully verified. You can now access your dashboard.</p>
          <a routerLink="/auth/login" class="btn w-full bg-primary-600 text-white hover:bg-primary-700 shadow-sm mt-4">
            Proceed to Sign In
          </a>
        </div>

        <div *ngIf="status() === 'error'" class="space-y-6">
          <div class="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-slate-600">{{ errorMessage() }}</p>
          <a routerLink="/auth/login" class="btn w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm mt-4">
            Back to Login
          </a>
        </div>
      </div>
    </app-form-wrapper>
  `
})
export class VerifyComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  status = signal<'loading' | 'success' | 'error'>('loading');
  statusMessage = signal('Email Verification');
  errorMessage = signal('The verification link is invalid or has expired.');

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.verifyToken(token);
    } else {
      this.status.set('error');
      this.statusMessage.set('Verification Failed');
    }
  }

  verifyToken(token: string) {
    this.authService.verify(token).subscribe({
      next: () => {
        this.status.set('success');
        this.statusMessage.set('Email Verified');
      },
      error: (err) => {
        this.status.set('error');
        this.statusMessage.set('Verification Failed');
        this.errorMessage.set(err.error?.message || 'The verification link is invalid or has expired.');
      }
    });
  }
}
