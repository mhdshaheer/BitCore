import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Overlay -->
    <div *ngIf="isOpen" 
         (click)="close.emit()" 
         class="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden">
    </div>

    <aside [class.translate-x-0]="isOpen" 
           class="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 lg:static lg:h-[calc(100vh-56px)]">
      <div class="h-full flex flex-col p-4">
        <nav class="flex-1 space-y-1">
          <a routerLink="/dashboard" 
             routerLinkActive="sidebar-item-active"
             (click)="close.emit()"
             class="sidebar-item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </a>
          <a routerLink="/my-urls" 
             routerLinkActive="sidebar-item-active"
             (click)="close.emit()"
             class="sidebar-item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            My Links
          </a>
        </nav>

        <div class="border-t border-slate-100 pt-4 mt-auto">
          <button (click)="onLogout.emit()" class="sidebar-item w-full text-red-600 hover:bg-red-50 hover:text-red-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();
}
