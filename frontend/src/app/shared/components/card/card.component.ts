import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['card', padding ? 'p-5' : '', hoverable ? 'hover:border-slate-300 transition-colors' : '', customClass]">
      <div *ngIf="title || subtitle" class="mb-5 border-b border-slate-100 pb-4 -mx-1">
        <div class="flex items-center justify-between gap-2 px-1">
          <div>
            <h3 *ngIf="title">{{ title }}</h3>
            <p *ngIf="subtitle" class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ subtitle }}</p>
          </div>
          <span *ngIf="badge" class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
            {{ badge }}
          </span>
        </div>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() badge?: string;
  @Input() customClass: string = '';
  @Input() padding: boolean = true;
  @Input() hoverable: boolean = false;
}
