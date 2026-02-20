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

        <div class="pt-1">
          <app-primary-button type="submit" [loading]="loading" [disabled]="loginForm.invalid">
            Sign In
          </app-primary-button>
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

  getControl(name: string): FormControl {
    return this.loginForm.get(name) as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toastService.show('Signed in successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.toastService.show(err.error?.message || 'Authentication failed', 'error');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
