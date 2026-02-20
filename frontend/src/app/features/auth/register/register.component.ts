import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormWrapperComponent } from '../../../shared/components/form-wrapper/form-wrapper.component';
import { InputFieldComponent } from '../../../shared/components/input/input-field.component';
import { PrimaryButtonComponent } from '../../../shared/components/button/primary-button.component';

@Component({
  selector: 'app-register',
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
    <app-form-wrapper [description]="isSuccess() ? 'Check your mail' : 'Create a new account to start shortening links.'">
      <div *ngIf="isSuccess()" class="text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">Verification Sent</h2>
        <p class="text-sm text-slate-500 mb-8 leading-relaxed">
          We've sent a verification link to <span class="font-bold text-slate-900">{{ registeredEmail() }}</span>. 
          Please check your inbox (and console) to activate your account.
        </p>
        <a routerLink="/auth/login" class="btn w-full bg-primary-600 text-white hover:bg-primary-700 shadow-sm">
          Back to Login
        </a>
      </div>

      <form *ngIf="!isSuccess()" [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <app-input-field
          label="Full Name"
          type="text"
          placeholder="John Doe"
          [control]="getControl('fullName')"
          errorMessage="Name is required"
        ></app-input-field>

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
          errorMessage="Minimum 6 characters required"
        ></app-input-field>

        <div class="pt-2">
          <app-primary-button type="submit" [loading]="loading" [disabled]="registerForm.invalid">
            Create Account
          </app-primary-button>
        </div>
      </form>

      <div footer *ngIf="!isSuccess()" class="text-xs text-slate-500 font-medium">
        Already have an account? 
        <a routerLink="/auth/login" class="text-primary-600 font-bold hover:underline ml-1">Sign in instead</a>
      </div>
    </app-form-wrapper>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  isSuccess = signal(false);
  registeredEmail = signal('');

  getControl(name: string): FormControl {
    return this.registerForm.get(name) as FormControl;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const email = this.registerForm.value.email;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.registeredEmail.set(email);
          this.isSuccess.set(true);
          this.toastService.show('Verification link sent');
        },
        error: (err) => {
          this.loading = false;
          this.toastService.show(err.error?.message || 'Registration failed', 'error');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
