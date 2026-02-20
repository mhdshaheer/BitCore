import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div class="w-full max-w-[400px]">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white font-bold text-xl mb-4 shadow-sm">
            B
          </div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">BitCore</h1>
          <p class="text-sm text-slate-500 mt-2">{{ description }}</p>
        </div>
        
        <div class="card p-8 shadow-md">
          <ng-content></ng-content>
        </div>
        
        <div class="mt-6 text-center">
            <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class FormWrapperComponent {
  @Input() description: string = '';
}
