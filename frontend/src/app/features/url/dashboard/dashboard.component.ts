import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { UrlService } from '../../../core/services/url.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PrimaryButtonComponent } from '../../../shared/components/button/primary-button.component';
import { InputFieldComponent } from '../../../shared/components/input/input-field.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Url } from '../../../core/models/api-response.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    CardComponent, 
    PrimaryButtonComponent, 
    InputFieldComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p class="text-sm text-slate-500 mt-1">Overview of your shortened links and performance.</p>
        </div>
      </div>

      <!-- Compact Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-card customClass="flex flex-col items-start px-6">
           <div class="flex items-center gap-2 mb-2">
             <div class="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Assets</span>
           </div>
           <span class="text-2xl font-bold text-slate-900 tabular-nums">{{ stats().totalUrls }}</span>
        </app-card>
        
        <app-card customClass="flex flex-col items-start px-6">
           <div class="flex items-center gap-2 mb-2">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Engagement</span>
           </div>
           <span class="text-2xl font-bold text-slate-900 tabular-nums">{{ stats().totalClicks }}</span>
        </app-card>

        <app-card customClass="flex flex-col items-start px-6">
           <div class="flex items-center gap-2 mb-2">
             <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Impact Ratio</span>
           </div>
           <span class="text-2xl font-bold text-slate-900 tabular-nums">{{ stats().avgClicks }}</span>
        </app-card>
      </div>

      <!-- Creation Form -->
      <app-card 
        title="Shorten a New URL" 
        subtitle="Provide a long URL to generate a compact manageable link."
      >
        <form [formGroup]="urlForm" (ngSubmit)="onSubmit()" class="flex flex-col sm:flex-row gap-4 items-start">
          <div class="flex-1 w-full">
            <app-input-field
              placeholder="https://example.com/very-long-url-path"
              [control]="getControl('originalUrl')"
              errorMessage="Enter a valid URL (http/https)"
            ></app-input-field>
          </div>
          <div class="w-full sm:w-40">
            <app-primary-button type="submit" [loading]="loading" [disabled]="urlForm.invalid">
              Shorten
            </app-primary-button>
          </div>
        </form>

        <!-- Result -->
        <div *ngIf="lastShortenedUrl()" class="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Original URL</p>
            <p class="text-xs text-slate-600 truncate mb-3">{{ lastShortenedUrl()!.originalUrl }}</p>
            
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shortened URL</p>
            <p class="text-sm font-bold text-primary-600 truncate">{{ getShortUrl(lastShortenedUrl()!.shortCode) }}</p>
          </div>
          <button 
            (click)="copyToClipboard(getShortUrl(lastShortenedUrl()!.shortCode))" 
            class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            Copy
          </button>
        </div>
      </app-card>

      <app-loading-spinner *ngIf="initialLoading" message="Loading dashboard data..." [fullPage]="true"></app-loading-spinner>
    </div>
  `
})
export class DashboardComponent {
  private fb = inject(FormBuilder);
  private urlService = inject(UrlService);
  private toastService = inject(ToastService);

  urlForm: FormGroup = this.fb.group({
    originalUrl: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
  });

  loading = false;
  initialLoading = true;
  lastShortenedUrl = signal<Url | null>(null);
  stats = signal({ totalUrls: 0, totalClicks: 0, avgClicks: 0 });

  constructor() {
    this.loadStats();
  }

  getControl(name: string): FormControl {
    return this.urlForm.get(name) as FormControl;
  }

  loadStats() {
      this.urlService.getMyUrls().subscribe({
        next: (res) => {
          const urls = res.data;
          const totalClicks = urls.reduce((acc: number, curr: Url) => acc + curr.clicks, 0);
          this.stats.set({
            totalUrls: urls.length,
            totalClicks,
            avgClicks: urls.length > 0 ? Math.round((totalClicks / urls.length) * 10) / 10 : 0
          });
          this.initialLoading = false;
        },
        error: () => this.initialLoading = false
      });
    }
  
    onSubmit() {
      if (this.urlForm.valid) {
        this.loading = true;
        this.urlService.shorten(this.urlForm.value.originalUrl).subscribe({
          next: (res) => {
            this.loading = false;
            this.lastShortenedUrl.set(res.data);
            this.urlForm.reset();
            this.loadStats();
            this.toastService.show('URL shortened successfully');
          },
          error: () => this.loading = false
        });
    } else {
      this.urlForm.markAllAsTouched();
    }
  }

  getShortUrl(code: string): string {
    return this.urlService.getShortUrl(code);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toastService.show('Copied to clipboard');
  }
}
