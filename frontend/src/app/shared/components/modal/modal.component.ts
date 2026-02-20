import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-[100] overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-slate-900/10 backdrop-blur-sm transition-opacity" 
          (click)="onClose()"
        ></div>

        <!-- Modal Panel -->
        <div class="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-slate-900 leading-none">{{ title }}</h3>
              <button (click)="onClose()" class="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="text-sm text-slate-600">
              <ng-content></ng-content>
            </div>
          </div>
          
          <div *ngIf="showFooter" class="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex flex-row-reverse gap-2">
             <ng-content select="[footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
