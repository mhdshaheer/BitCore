import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full space-y-1">
      <label *ngIf="label" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">
        {{ label }}
      </label>
      
      <div class="relative group">
        <input
          [type]="isPasswordField && showPassword() ? 'text' : type"
          [formControl]="control"
          [placeholder]="placeholder"
          [class.border-red-500]="control.invalid && control.touched"
          [class.focus:ring-red-500/20]="control.invalid && control.touched"
          [class.focus:border-red-500]="control.invalid && control.touched"
          [class.pr-10]="isPasswordField"
          class="form-input"
        >
        
        <button 
          *ngIf="isPasswordField"
          type="button"
          (click)="togglePassword()"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          <!-- Eye icon -->
          <svg *ngIf="!showPassword()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <!-- Eye-off icon -->
          <svg *ngIf="showPassword()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.659.13 2.427.365m3.42 3.42A9.954 9.954 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7-1.012 0-1.977-.184-2.863-.513M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3.75 3.75L15 12" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
          </svg>
        </button>
      </div>

      <p 
        *ngIf="control.invalid && control.touched" 
        class="text-[11px] text-red-600 font-medium"
      >
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class InputFieldComponent {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() errorMessage: string = 'Invalid input';

  showPassword = signal(false);

  get isPasswordField(): boolean {
    return this.type === 'password';
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }
}
