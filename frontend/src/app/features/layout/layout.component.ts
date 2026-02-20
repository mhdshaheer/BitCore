import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { NavbarComponent } from '../../shared/components/layout/navbar.component';
import { SidebarComponent } from '../../shared/components/layout/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, NavbarComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <app-toast></app-toast>
      
      <app-navbar 
        [user]="currentUser()" 
        (toggleSidebar)="sidebarOpen.set(!sidebarOpen())"
      ></app-navbar>

      <div class="flex flex-1 max-w-[1600px] mx-auto w-full relative">
        <app-sidebar 
          [isOpen]="sidebarOpen()" 
          (close)="sidebarOpen.set(false)"
          (onLogout)="handleLogout()"
        ></app-sidebar>

        <main class="flex-1 min-w-0 px-4 py-8 md:px-8 lg:px-12 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = this.authService.currentUser;
  sidebarOpen = signal(false);

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
