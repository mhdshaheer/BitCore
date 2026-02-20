import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div class="w-full max-w-[400px]">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white font-black text-2xl mb-5 shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-transform duration-300">
            B
          </div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-2">BitCore</h1>
          <p class="text-[13px] font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">{{ description }}</p>
        </div>
        
        <div class="card px-7 py-8 shadow-xl shadow-slate-200/50 border-slate-100">
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
