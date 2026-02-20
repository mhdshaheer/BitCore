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
           'fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border transition-all animate-toast-in min-w-[320px] max-w-md',
           toast()?.type === 'success' 
             ? 'bg-white/80 backdrop-blur-xl border-emerald-100 text-slate-900 shadow-emerald-500/10' 
             : 'bg-white/80 backdrop-blur-xl border-red-100 text-slate-900 shadow-red-500/10'
         ]">
      <div *ngIf="toast()?.type === 'success'" class="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div *ngIf="toast()?.type === 'error'" class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[13px] font-bold tracking-tight text-slate-900 leading-none mb-0.5">
          {{ toast()?.type === 'success' ? 'Success' : 'Attention Needed' }}
        </p>
        <p class="text-xs font-medium text-slate-500 truncate">{{ toast()?.message }}</p>
      </div>
      <button (click)="toastService.hide()" class="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      
      <!-- Progress Bar -->
      <div class="absolute bottom-0 left-0 h-1 bg-slate-100/50 w-full rounded-b-2xl overflow-hidden">
        <div [ngClass]="[
          'h-full animate-progress',
          toast()?.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        ]"></div>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
  toast = this.toastService.toast;
}
