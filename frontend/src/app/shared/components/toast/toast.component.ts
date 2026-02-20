import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toast()" 
         [ngClass]="[
           'fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-in slide-in-from-right-10 fade-in',
           toast()?.type === 'success' ? 'bg-white border-slate-200 text-slate-900' : 'bg-red-50 border-red-200 text-red-900'
         ]">
      <div *ngIf="toast()?.type === 'success'" class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div *ngIf="toast()?.type === 'error'" class="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
      <p class="text-sm font-semibold tracking-tight">{{ toast()?.message }}</p>
      <button (click)="toastService.hide()" class="ml-2 text-slate-400 hover:text-slate-600 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
  toast = this.toastService.toast;
}
