import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['flex flex-col items-center justify-center', fullPage ? 'fixed inset-0 bg-slate-50/80 backdrop-blur-[1px] z-[100]' : 'py-6']">
      <div class="relative">
        <!-- Spinner Track -->
        <div [ngClass]="[sizeClasses[size], 'border-slate-200 border-2 rounded-full']"></div>
        <!-- Spinner Indicator -->
        <div [ngClass]="[sizeClasses[size], 'border-primary-600 border-t-2 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute inset-0']"></div>
      </div>
      <p *ngIf="message" class="text-xs font-semibold text-slate-500 mt-3 tracking-wide">{{ message }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  @Input() fullPage: boolean = false;

  sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
}
