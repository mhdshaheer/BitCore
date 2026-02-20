import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div class="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button (click)="toggleSidebar.emit()" class="p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-md lg:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <a routerLink="/dashboard" class="flex items-center gap-2">
            <div class="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">B</div>
            <span class="text-lg font-bold text-slate-900 tracking-tight">BitCore</span>
          </a>
        </div>

        <div class="flex items-center gap-4 border-l border-slate-100 pl-4">
          <div class="flex flex-col items-end leading-tight">
            <span class="text-xs font-semibold text-slate-900">{{ user?.fullName }}</span>
            <span class="text-[10px] text-slate-500">{{ user?.email }}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
            {{ user?.fullName?.charAt(0) }}
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() user: User | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();
}
