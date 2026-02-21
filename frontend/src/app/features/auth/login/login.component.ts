import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormWrapperComponent } from '../../../shared/components/form-wrapper/form-wrapper.component';
import { InputFieldComponent } from '../../../shared/components/input/input-field.component';
import { PrimaryButtonComponent } from '../../../shared/components/button/primary-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    FormWrapperComponent, 
    InputFieldComponent, 
    PrimaryButtonComponent
  ],
  template: `
    <app-form-wrapper description="Sign in to manage your shortened links.">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
        <app-input-field
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          [control]="getControl('email')"
          errorMessage="Enter a valid email address"
        ></app-input-field>

        <app-input-field
          label="Password"
          type="password"
          placeholder="••••••••"
          [control]="getControl('password')"
          errorMessage="Password is required"
        ></app-input-field>

        <div class="flex items-center justify-between -mt-1">
          <label class="flex items-center gap-2 group cursor-pointer">
            <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20 transition-all cursor-pointer">
            <span class="text-[13px] text-slate-500 font-semibold group-hover:text-slate-700 transition-colors">Remember me</span>
          </label>
          <a href="#" class="text-[13px] font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</a>
        </div>

        <div class="pt-1 flex flex-col gap-3">
          <app-primary-button type="submit" [loading]="loading" [disabled]="loginForm.invalid">
            Sign In
          </app-primary-button>
          
          <button 
            *ngIf="showResend" 
            type="button"
            (click)="onResend()"
            [disabled]="resending"
            class="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 py-2"
          >
            <span *ngIf="resending" class="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
            Lost verification link? Resend Link
          </button>
        </div>
      </form>

      <div footer class="text-xs text-slate-500 font-medium">
        Don't have an account? 
        <a routerLink="/auth/register" class="text-primary-600 font-bold hover:underline ml-1">Create an account</a>
      </div>
    </app-form-wrapper>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  loading = false;
  showResend = false;
  resending = false;

  getControl(name: string): FormControl {
    return this.loginForm.get(name) as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.showResend = false;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toastService.show('Signed in successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          const message = err.error?.message || 'Authentication failed';
          this.toastService.show(message, 'error');
          
          if (message.toLowerCase().includes('verify your email')) {
            this.showResend = true;
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onResend() {
    const email = this.loginForm.get('email')?.value;
    if (!email) return;

    this.resending = true;
    this.authService.resendVerification(email).subscribe({
      next: (res) => {
        this.resending = false;
        this.showResend = false;
        this.toastService.show(res.message || 'Verification link resent');
      },
      error: (err) => {
        this.resending = false;
        this.toastService.show(err.error?.message || 'Failed to resend link', 'error');
      }
    });
  }
}
