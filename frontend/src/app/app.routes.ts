import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/verify',
    loadComponent: () => import('./features/auth/verify/verify.component').then(m => m.VerifyComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/url/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'my-urls',
        loadComponent: () => import('./features/url/my-urls/my-urls.component').then(m => m.MyUrlsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./features/error/error-page.component').then(m => m.ErrorPageComponent),
    data: {
      code: '404',
      title: 'Page not found',
      message: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
    }
  },
  {
    path: '500',
    loadComponent: () => import('./features/error/error-page.component').then(m => m.ErrorPageComponent),
    data: {
      code: '500',
      title: 'Server error',
      message: "Something went wrong on our end. Please try again later or contact support if the problem persists."
    }
  },
  {
    path: 'error',
    children: [
      { path: '404', redirectTo: '/404', pathMatch: 'full' },
      { path: '500', redirectTo: '/500', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
