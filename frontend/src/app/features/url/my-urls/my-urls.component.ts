import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UrlService } from '../../../core/services/url.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Url } from '../../../core/models/api-response.model';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SecondaryButtonComponent } from '../../../shared/components/button/secondary-button.component';
import { PrimaryButtonComponent } from '../../../shared/components/button/primary-button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-my-urls',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    RouterLink, 
    LoadingSpinnerComponent, 
    SecondaryButtonComponent, 
    PrimaryButtonComponent,
    ModalComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1>My Links</h1>
          <p class="text-sm text-slate-500 mt-1">Manage and track your active shortened URLs.</p>
        </div>
        <a routerLink="/dashboard" class="btn bg-primary-600 text-white hover:bg-primary-700 shadow-sm">
           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
           New Link
        </a>
      </div>

      <app-card [padding]="false" customClass="overflow-hidden">
        <div class="overflow-x-auto min-h-[400px] relative">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th class="px-6 py-3">Short URL</th>
                <th class="px-6 py-3">Destination</th>
                <th class="px-6 py-3">Engagement</th>
                <th class="px-6 py-3">Created</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let url of urls()" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-3.5">
                  <span class="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-default">{{ getShortUrl(url.shortCode).split('://')[1] }}</span>
                </td>
                <td class="px-6 py-3.5">
                  <p class="text-xs text-slate-500 max-w-[240px] truncate" [title]="url.originalUrl">{{ url.originalUrl }}</p>
                </td>
                <td class="px-6 py-3.5">
                  <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 tabular-nums">
                    {{ url.clicks }}
                  </div>
                </td>
                <td class="px-6 py-3.5">
                   <span class="text-[11px] text-slate-500 font-medium whitespace-nowrap tabular-nums">{{ url.createdAt | date:'dd MMM yyyy' }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      (click)="copyToClipboard(getShortUrl(url.shortCode))" 
                      class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      title="Copy"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    </button>
                    <button 
                      (click)="confirmDelete(url)" 
                      class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="urls().length === 0 && !loading">
                <td colspan="5" class="px-6 py-20 text-center">
                   <p class="text-sm text-slate-500">No links found. Create your first link in the dashboard.</p>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="loading" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
             <app-loading-spinner message="Updating list..."></app-loading-spinner>
          </div>
        </div>
      </app-card>

      <!-- Confirmation Modal -->
      <app-modal 
        [isOpen]="isModalOpen()" 
        title="Delete Link" 
        (close)="isModalOpen.set(false)"
      >
        <div class="space-y-4">
          <p class="text-sm text-slate-600 leading-relaxed">Are you sure you want to delete this shortened link? This action will permanently remove all associated click analytics.</p>
          <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Target Link</span>
            <p class="text-sm font-semibold text-slate-900 truncate">{{ urlToDelete()?.shortCode }}</p>
          </div>
        </div>
        
        <div footer class="flex gap-3 w-full">
          <app-secondary-button class="flex-1" (click)="isModalOpen.set(false)">Cancel</app-secondary-button>
          <app-primary-button 
            variant="danger"
            class="flex-1" 
            (click)="handleDelete()"
            [loading]="isDeleting"
          >
            Delete
          </app-primary-button>
        </div>
      </app-modal>
    </div>
  `
})
export class MyUrlsComponent {
  private urlService = inject(UrlService);
  private toastService = inject(ToastService);
  
  urls = signal<Url[]>([]);
  loading = true;
  isModalOpen = signal(false);
  urlToDelete = signal<Url | null>(null);
  isDeleting = false;

  constructor() {
    this.loadUrls();
  }

  loadUrls() {
    this.loading = true;
    this.urlService.getMyUrls().subscribe({
      next: (res) => {
        this.urls.set(res.data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getShortUrl(code: string): string {
    return this.urlService.getShortUrl(code);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toastService.show('Link copied');
  }

  confirmDelete(url: Url) {
    this.urlToDelete.set(url);
    this.isModalOpen.set(true);
  }

  handleDelete() {
    const url = this.urlToDelete();
    if (!url) return;

    this.isDeleting = true;
    this.urlService.deleteUrl(url.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isModalOpen.set(false);
        this.toastService.show('Link deleted');
        this.loadUrls();
      },
      error: (err) => {
        this.isDeleting = false;
        this.toastService.show(err.error?.message || 'Delete failed', 'error');
      }
    });
  }
}
