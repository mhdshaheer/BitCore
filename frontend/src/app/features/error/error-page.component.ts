import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PrimaryButtonComponent } from '../../shared/components/button/primary-button.component';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PrimaryButtonComponent],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <!-- Error Illustration / Icon -->
        <div class="relative flex justify-center">
          <div class="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50 scale-150"></div>
          <div class="relative bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
             <span class="text-7xl font-black text-primary-600 tracking-tighter tabular-nums">
               {{ code }}
             </span>
          </div>
        </div>

        <div class="space-y-3">
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {{ title }}
          </h1>
          <p class="text-base text-slate-500 leading-relaxed max-w-xs mx-auto">
            {{ message }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <app-primary-button 
            class="min-w-[140px]" 
            routerLink="/"
          >
            Back to Safety
          </app-primary-button>
          
          <button 
            (click)="goBack()"
            class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>

        <div class="pt-8 border-t border-slate-200/60">
          <p class="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Ref: BIT-ERR-{{ code }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class ErrorPageComponent implements OnInit {
  @Input() code: string = '404';
  @Input() title: string = 'Page not found';
  @Input() message: string = "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.";

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Handle data from routes
    this.route.data.subscribe(data => {
      if (data['code']) this.code = data['code'];
      if (data['title']) this.title = data['title'];
      if (data['message']) this.message = data['message'];
    });

    // Handle query params (e.g. offline status)
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'offline') {
        this.title = 'No Internet Connection';
        this.message = 'It looks like you are offline. Please check your network connection and try again.';
      }
    });
  }

  goBack() {
    window.history.back();
  }
}
